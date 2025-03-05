import { Hono } from "hono";
import { unAllotSeat, updateSeat } from "../utils/updateSeat";
import { sendAllotmentNotification } from "../utils/sendSMS";

export const allotRouter = new Hono();


allotRouter.post("/", async (c)=>{
  //request body {
  //   member_id,
  //   seat_num,
  //   start_date,
  //   end_date,
  //   full_day,
  //   first_half,
  //   second_half
  // }
// check whether startDate < EndDate and startTime < endTime

  const prisma = c.get("prisma");
  const body = await c.req.json();
  let isAvailable = false;  

  //check whether seat exists
  try{
    const seat = await prisma.seat.upsert({
      where:{
        seat_num: body.seat_num,
      },
      update:{},
      create:{
        seat_num: body.seat_num
      }
    })

    //check seat availability
    if(body.full_day && !(seat.fh_allotted || seat.sh_allotted)){//for full day
      console.log("available for full day");
      isAvailable = true;
    }else if(body.first_half && !seat.fh_allotted){
      console.log("available for first half");
      isAvailable = true;
    }else if(body.second_half && !seat.sh_allotted){
      console.log("available for second half");
      isAvailable = true;
    }

    //BOTH SLOT AND TIMING AVAILABLE, THEN ALLOT SEAT, ELSE RETURN MESSAGE
    if(isAvailable){ 
      const newAllotment = await prisma.allotment.create({
        data:{
          member_id: body.member_id,
          seat_num: body.seat_num,
          start_date: body.start_date,
          end_date: body.end_date,
          full_day: body.full_day,
          first_half: body.first_half,
          second_half: body.second_half
        }
      })
      
      //UPDATE SEAT SLOT
      let newSeat = await updateSeat({
        full_day: body.full_day,
        first_half: body.first_half,
        second_half: body.second_half,
        seat_num: body.seat_num,
        id: newAllotment.id,
        prisma:prisma
      })
      
      //CHANGE MEMBER STATUS
      const member = await prisma.member.update({
        where:{
          id: body.member_id
        },
        data:{
          last_allot_id: newAllotment.id,
          status: "current"
        }
      })

      //SEND WELCOME SMS
      const smsbody = await sendAllotmentNotification(member,newAllotment,c.get("SMS_WEBHOOK_URL"));
      

      return c.json({
        newAllotment: newAllotment,
        updatedSeat: newSeat || null,
        smsbody: smsbody
      })
    }else{
      c.status(403);
      return c.text("seat cannot be alloted")
    }
  }catch(e){
    console.log(e)
    c.status(403);
    return c.text("invalid inputs")
  }
});

allotRouter.put("/:id",async (c)=>{
  //CHANGE DATES, TIMINGS, SEAT_NUM
  //request {
  // allotment:{
  //   seat_num:
  //   start_date:
  //   end_date:
  //   first_half:
  //   second_half:
  //   full_day:
  // }

  const prisma = c.get("prisma");
  const body = await c.req.json();
  const id = c.req.param("id"); //allotment_id
  let isAvailable = false;
  
  //FETCH ALLOTMENT DETAILS(original)
  try{
    const previousAllotment = await prisma.allotment.findFirst({
      where:{
        id: id
      }
    });

    const seat = await prisma.seat.upsert({
      where:{
        seat_num: body.seat_num,
      },
      update:{},
      create:{
        seat_num: body.seat_num
      }
    })

    //IF SEAT_NUM CHANGED, CHECK NEW SEAT AVAILIBILITY,
    if(body.seat_num != previousAllotment.seat_num){

      //check seat availability
      if(body.full_day && !(seat.fh_allotted || seat.sh_allotted)){//for full day
        isAvailable = true;
      }else if(body.first_half && !seat.fh_allotted){
        isAvailable = true;
      }else if(body.second_half && !seat.sh_allotted){
        isAvailable = true;
      }

      //BOTH SLOT AND TIMING AVAILABLE, THEN ALLOT SEAT, ELSE RETURN MESSAGE
      if(isAvailable){ 

        //FREE UP PREVIOUS SEAT
        const oldSeat = await unAllotSeat(previousAllotment, prisma);
        
        
        const updatedAllotment = await prisma.allotment.update({
          where:{
            id: previousAllotment.id
          },
          data:{
            seat_num: body.seat_num,
            start_date: body.start_date,
            end_date: body.end_date,
            full_day: body.full_day,
            first_half: body.first_half,
            second_half: body.second_half
          }
        })
        
        //UPDATE SEAT SLOT
        let newSeat = await updateSeat({
          full_day: body.full_day,
          first_half: body.first_half,
          second_half: body.second_half,
          seat_num: body.seat_num,
          id: updatedAllotment.id,
          prisma
        })

        return c.json({
          allotment: updatedAllotment,
          updatedSeat: newSeat || null
        })
      }else{
        c.status(403);
        return c.text("seat cannot be alloted")
      }

    }else{//IF SEAT UNCHANGED
      //IF CHANGING SLOTS, CHECK WHETHER OTHER SLOT IS FREE or NOT
      let fh_available = true; 
      let sh_available = true; 

      if(body.first_half){// if user want first_half
        //check whether first_half is empty or already alloted to same user
        if((!seat.fh_allotted) || seat.fh_allotment == previousAllotment.id){
          fh_available = true;
        }else{
          fh_available = false;
        }
      }
      if(body.second_half){// if user want second_half
        //if second half is empty OR already alloted to same user
        if((!seat.sh_allotted) || seat.sh_allotment == previousAllotment.id){
          sh_available = true;
        }else{
          sh_available = false;
        }
      }
        //UPDATE ALLOTMENT
      if(fh_available && sh_available){ 
        const updatedAllotment = await prisma.allotment.update({
          where:{
            id: previousAllotment.id
          },
          data:{
            seat_num: body.seat_num,
            start_date: body.start_date,
            end_date: body.end_date,
            full_day: body.full_day,
            first_half: body.first_half,
            second_half: body.second_half
          }
        })
        
        //UPDATE SAME SEAT SLOTs
        let newSeat = await prisma.seat.update({
          where:{
            seat_num: body.seat_num
          },
          data:{
            fh_allotted: body.first_half,
            fh_allotment: (body.first_half? updatedAllotment.id : null),
            sh_allotted: body.second_half,
            sh_allotment: (body.second_half? updatedAllotment.id : null)
          }
        })

        return c.json({
          allotment: updatedAllotment,
          updatedSeat: newSeat || null
        })
      }else{
        c.status(403);
        return c.text("seat cannot be alloted")
      }
    }
  }catch(e){
    console.log(e);
    c.status(403);
    return c.text("Sorry Allotment Cannot be updated")
  } 
})

allotRouter.delete("/end", async (c)=>{
  //req {
  // id: allotment_id
  //}


  const body = await c.req.json();
  const prisma = c.get("prisma");
  try{
    //fetch allotment
    const previousAllotment = await prisma.allotment.findFirst({
      where:{
        id: body.id
      }
    })

    //FREE UP SEAT SLOT
    const oldSeat = await unAllotSeat(previousAllotment, prisma);

    //UPDATE MEMBER STATUS : PREVIOUS
    const member = await prisma.member.update({
      where:{
        id: previousAllotment.member_id
      },
      data:{
        last_allot_id: null,
        status: "previous"
      }
    })

    //DELETE ALLOTMENT
    await prisma.allotment.delete({
      where:{
        id: previousAllotment.id
      }
    })

    return c.json({
      member: member,
      oldSeat: oldSeat
    })

  }catch(e){
    console.log(e)
    c.status(403);
    return c.text("Incorrect Inputs for deletion")
  }
  
})

allotRouter.get("/",async(c)=>{
  const prisma = c.get("prisma")
  const allotment = await prisma.allotment.findMany({});

  return c.json({
    allotment: allotment
  })
})

allotRouter.get("/:id",async (c)=>{
  //SEAT GRID DETAIL FETCHING
  const id = c.req.param("id")
  const prisma = c.get("prisma")
  try{
    const allotment = await prisma.allotment.findFirst({
      where:{
        id: id
      }
    })

    return c.json({
      allotment: allotment
    })
  }catch(e){
    console.log(e);
    c.status(403)
    return c.text("Incorrect ID")
  }
})

