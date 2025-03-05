
import { Hono } from "hono";
import { sendWelcome } from "../utils/sendSMS";

export const memberRouter = new Hono();

memberRouter.post("/add", async (c)=>{
  //request
  // {
  //   "name": "Yash Jain",
  //   "phone_number": 9826836812,
  //   "email": "yash@gmail.com"
  // }

  const body = await c.req.json();

  //zod validation
  
  const prisma = c.get("prisma")
  try{
    
    const member = await prisma.member.create({
      data:{
        name: body.name,
        phone_number: body.phone_number,
        email: body.email || null,
      }
    })
    //SEND WELCOME SMS
    const smsbody = await sendWelcome(member,c.get("SMS_WEBHOOK_URL"))

    c.status(200)
    return c.json({
      "member": member,
      "smsbody": smsbody
    })
  }catch(e){
    c.status(403)
    return c.text("Incorrect Inputs")
  }
})

memberRouter.put("/update",async (c)=>{
  //request body { id: member_id }

  const body = await c.req.json();

  //zod validation

  const prisma = c.get("prisma");
  try{
    const member = await prisma.member.update({
      where:{
        id: body.id
      },
      data:{
        name: body.name,
        phone_number: body.phone_number,
        email: body.email || null,
        status: body.status || undefined
      }
    })
    return c.json({
      "member":member
    })
  }catch(e){
    c.status(403);
    return c.text("Incorrect Inputs")
  }
})

//for table view, fetch members
memberRouter.get("/all", async (c)=>{
  
  const prisma = c.get("prisma");
  
  try{
    const allMembers = await prisma.$queryRaw`
      SELECT
        member.id, name, phone_number, email, status, created_on, last_allot_id, seat_num, start_date, end_date
      FROM 
        member
      LEFT JOIN
        allotment
      ON 
        member.last_allot_id = allotment.id
    `;
  
  return c.json({
    members: allMembers
  })

  }catch(e){
    console.log(e)
    c.status(404)
    return c.json({
      "message": "Please Try Again" 
    });
  }
})

memberRouter.get("/:id", async (c)=>{
  const mid = c.req.param("id");
  console.log(mid)
  const prisma = c.get("prisma");

  try{
    const member = await prisma.member.findFirst({
      where:{
        id: mid
      },
      select:{
        id: true,
        name: true,
        phone_number: true,
        email: true,
        status: true,
        last_allot_id: true,
        created_on: true
        }
      });
    
    let lastAllotment = null;
    if(member.last_allot_id){
       lastAllotment = await prisma.allotment.findFirst({
        where:{
          AND:[
            {id: member.last_allot_id},
            {member_id: member.id}
          ]
        }
      })
    }
    
    return c.json({
      "member":member,
      "lastAllotment":lastAllotment
    })
  }catch(e){
    console.log(e);
    c.status(403);
    return c.text("Incorrect Id")
  }  
})


