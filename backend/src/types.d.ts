// types.d.ts
import { PrismaClient } from '@prisma/client';
import { Bindings } from 'hono';

// If you're using Prisma Accelerate
import { withAccelerate } from '@prisma/extension-accelerate';

declare module 'hono' {
  interface ContextVariableMap {
    prisma: any, // there is a better way for this
    SMS_WEBHOOK_URL: string
  }
  
  // Extend env bindings if needed
  interface Bindings {
    
  }
}