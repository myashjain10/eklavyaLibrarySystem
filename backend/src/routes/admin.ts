
import { Hono } from "hono";

export const adminRouter = new Hono();

//CREATE MEMBER
adminRouter.post("/add", async (c)=>{
  //request
  // {
  //   "admin_name": admin
  //   "password": <password>
  // }

  const body = await c.req.json();

  //zod validation
  
  const prisma = c.get("prisma")
  try{
    
  }catch(e){
    c.status(403)
    return c.text("Incorrect Inputs")
  }
})