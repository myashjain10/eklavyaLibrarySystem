import { Hono } from 'hono'
import { memberRouter } from './routes/member'
import { allotRouter } from './routes/allotment'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { authMiddleware } from './middlewares/authmiddleware'
import adminRouter from './routes/admin'
import { jwt } from 'hono/jwt'
import { cors } from 'hono/cors'


interface Env {
  DEV_DATABASE_URL: string,
  DEV_JWT_SECRET: string,
  SMS_WEBHOOK_URL: string,
  
  PROD_DATABASE_URL: string,
  PROD_JWT_SECRET: string
}

const app = new Hono<{
  Bindings:Env,
  Variables:{
    SMS_WEBHOOK_URL: string,
    JWT_SECRET: string,
  }
}>()

app.use(cors())

app.get('/', (c) => {
  return c.text('welcome to Eklavya Library');
})

//prisma middleware, not using from prismaMiddleware.ts
app.use("/api/v1/*", async (c,next)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.PROD_DATABASE_URL,
  }).$extends(withAccelerate());

  // Add the prisma client to the context
  c.set('prisma', prisma);
  c.set('SMS_WEBHOOK_URL',c.env.SMS_WEBHOOK_URL)

  // Continue to the next middleware or route handler
  await next();
})

//admin routes
app.use("/api/v1/admin/*", async (c, next)=>{
  c.set("JWT_SECRET", c.env.PROD_JWT_SECRET);
  await next();
})
app.route("/api/v1/admin", adminRouter)


//auth middleware for other routes
// app.use("api/v1/*",authMiddleware())

app.route("/api/v1/member", memberRouter)
app.route("/api/v1/allotment", allotRouter)


export default app