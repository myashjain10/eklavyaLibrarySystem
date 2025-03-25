import { Hono } from "hono";
import { adminLoginSchema, adminSchema } from "../validation/schemas";
import { sign } from "hono/jwt";
import { hashPassword, verifyPassword } from "../utils/passwordHasher";
import { date } from "zod";
const adminRouter = new Hono();

//CREATE MEMBER (DEV PORTION)
adminRouter.post("/add", async (c)=>{
  //request
  // {
  //   "admin_name": admin
  //   "password": <password>
  // }
  const body = await c.req.json();
  
  //zod validation
  const result = adminSchema.safeParse(body)
  if(!result.success){
    c.status(403)
    return c.json({
      error: result
    })
  }
  
  const prisma = c.get("prisma")
  
  try{
    
    //hash the password
    const hash = await hashPassword(body.password)
    
    const admin = await prisma.admin.create({
      data: {
        admin_name: body.admin_name,
        password: hash,
      },
    });

    // Save the admin in the database
    

    // Generate JWT
    const jwtSecret = c.get("JWT_SECRET");
    if (!jwtSecret) {
      throw new Error("PROD_JWT_SECRET not found in context");
    }
    const payload = {
      admin: body.admin_name,
      exp: (Math.floor((Date.now())/1000)) + 86400 //expire after 24 hours
    }
    const token = await sign(payload, jwtSecret);

    return c.json({
      message: "Admin created Successfully",
      token: token
    })

  }catch(e){
    c.status(403)
    console.log(e)
    return c.text("Incorrect Inputs")
  }
})

//password update route -  requires old password
adminRouter.post("/password", async (c) => {
  const body = await c.req.json();
  
  //zod validation
  const result = adminLoginSchema.safeParse(body)
  if(!result.success){
    c.status(403)
    return c.text("Invalid Inputs")
  }
  
  const prisma = c.get("prisma")
  
  try{
    //fetch old password
    const admin = await prisma.admin.findFirst({
      where:{
        admin_name: body.admin_name
      },
      
    })
    //compare previousPassword with given old_password
    const passwordMatch = await verifyPassword( body.old_password, admin.password )

    if(passwordMatch){// change old with new password
      //generate new password hash
      const newHash = await hashPassword(body.new_password)

      await prisma.admin.update({
        where:{
          admin_name: body.admin_name
        },
        data:{
          password: newHash
        }
      })
    } else {
      c.status(403);
      return c.json({
        message: "Old Password Doesn't match"
      })
    }

    return c.json({
      message: "password Updated Successfully"
    })

  }catch(e){
    c.status(403)
    console.log(e)
    return c.text("Incorrect Inputs")
  }
})

adminRouter.post("/login", async (c)=>{
  // request = {
  //   admin_name: smthg
  //   password: password
  // }
  const body = await c.req.json();
  
  //zod validation
  const result = adminSchema.safeParse(body)
  if(!result.success){
    c.status(403)
    return c.text("Invalid Inputs")
  }
  
  const prisma = c.get("prisma")

  try{
    //check admin_name existence
    //then verify password

    const admin = await prisma.admin.findFirst({
      where:{
        admin_name: body.admin_name
      }
    })
    if(!admin){
      c.status(404)
      return c.json({
        message: "Admin doesn't exist"
      })
    }
    const passwordMatch = await verifyPassword(body.password, admin.password);
    if(passwordMatch){

      // Generate JWT
      const jwtSecret = c.get("JWT_SECRET");
      if (!jwtSecret) {
        throw new Error("PROD_JWT_SECRET not found in context");
      }
      const payload = {
        admin: body.admin_name,
        exp: (Math.floor((Date.now())/1000)) + 86400//expire after 24 hours
      }
      const token = await sign(payload, jwtSecret);
      
      return c.json({
        message: "logged In successfully",
        token: token
      })
    }

  }catch(e){
    c.status(403)
    console.log(e)
    return c.text("Incorrect Inputs")
  }

})

export default adminRouter;