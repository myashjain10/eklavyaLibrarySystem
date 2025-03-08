import { Context, MiddlewareHandler } from 'hono';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

export const prismaMiddleware = (): MiddlewareHandler => {
  return async (c: Context, next) => {
    // Initialize Prisma with the DATABASE_URL from environment bindings
    const prisma = new PrismaClient({
      datasourceUrl: c.env.PROD_DATABASE_URL,
    }).$extends(withAccelerate());

    // Add the prisma client to the context
    c.set('prisma', prisma);

    // Continue to the next middleware or route handler
    await next();
    
    // Optionally, disconnect the Prisma client after the response
    // This depends on your specific needs
    await prisma.$disconnect();
  };
};
