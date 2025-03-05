import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { memberRouter } from './routes/member'
import { allotRouter } from './routes/allotment'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClientExtends } from '@prisma/client/extension'
import { prismaMiddleware } from './middlewares/prismaMiddleware'

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
    SMS_WEBHOOK_URL: string
  }
}>()


app.get('/', (c) => {
  return c.text('Eklavya Landing Page. Your DEV DB string is ' + c.env.DEV_DATABASE_URL)
})

//apply prisma middleware
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

app.route("/api/v1/member", memberRouter)
app.route("/api/v1/allotment", allotRouter)

export default app
