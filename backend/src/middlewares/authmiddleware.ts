import { Context, MiddlewareHandler } from 'hono';
import { verify } from 'hono/jwt';


export const authMiddleware = (): MiddlewareHandler =>{
  return async (c: Context, next) =>{
    const header = c.req.header("Authorization") || ""; 
  // If sent as Bearer token, then split and extract token
  try{
    const response = await verify(header, c.env.PROD_JWT_SECRET);
    if (response){
      await next()
    } else {
      c.status(403);
      return c.json({ message: "unauthorised"});
    }
  }catch(e){
    c.status(403);
    return c.json({
      message: "Please Log in"
    });
  }
  }
}