import { Hono } from "hono";

const seatRouter = new Hono();

seatRouter.get("/check/:seatNum",async (c)=>{
  const seatNum = c.req.param('seatNum');
  const prisma = c.get("prisma");
  try{
    let seat = await prisma.seat.findFirst({
      where:{
        seat_num: parseInt(seatNum)
      }
    })
    if(!seat){
      seat = {
        seat_num: seatNum,
        fh_allotted: false,
        sh_allotted: false,
      }
    }
    return c.json({
      "seat": seat
    })
  } catch(e){
    // console.log(e)
    c.status(404);
    return c.json({
      message: "Seat number does not exist"
    })
  }
})

export default seatRouter;