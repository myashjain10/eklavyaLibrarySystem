import { Hono } from "hono";
import { sendWelcome } from "../utils/sendSMS";
import { memberSchema } from "../validation/schemas";

export const memberRouter = new Hono();

//CREATE MEMBER
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
      "member_id": member.id,
      "smsbody": smsbody
    })
  }catch(e){
    c.status(403)
    return c.text("Incorrect Inputs")
  }
})

//UPDATE MEMBER
memberRouter.put("/update",async (c)=>{
  //request body 
  // {
  //   "id": "123asdfas12312"
  //   "name": "Yash Jain",
  //   "phone_number": 9826836812,
  //   "email": "yash@gmail.com"
  // }

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
      "member_id":member.id
    })
  }catch(e){
    c.status(403);
    return c.text("Incorrect Inputs")
  }
})

//for table view, fetch members
memberRouter.get("/bulk", async (c)=>{
  
  try{

    //filter params
    const nameQuery = c.req.query("name")
    const statusQuery = c.req.query("status")

    // pagination params
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "20");

    const offset = (page - 1) * limit;

    const prisma = c.get("prisma");

    const whereClause:{name?:object, status?:string} = {}

    if(nameQuery){
      whereClause.name = {
        contains: nameQuery, // Case-insensitive search for name containing the query
        mode: "insensitive", // Make the search case-insensitive
      }
    }
    if(statusQuery){
      whereClause.status = statusQuery
    }
    const filteredMembers = await prisma.member.findMany({
      where: whereClause,
      include: {
        lastAllotment: true, // Include last allotment details
      },
      skip: offset, // Pagination: skip certain rows
      take: limit, // Pagination: limit the number of rows
    });
  
  return c.json({
    members: filteredMembers
  })

  }catch(e){
    console.log(e)
    c.status(404)
    return c.json({
      "message": "Please Try Again" 
    });
  }
})

//GET ONE MEMBER
memberRouter.get("/single/:id", async (c)=>{
  const member_id = c.req.param("id");

  const prisma = c.get("prisma");

  try{
    const member = await prisma.member.findFirst({
      where: {
        id: member_id
      },
      include: {
        lastAllotment: true, // Include last allotment details
      },
});
    
    return c.json({
      member: member
    })
  }catch(e){
    console.log(e);
    c.status(403);
    return c.text("Incorrect Id")
  }  
})


