import type { ScheduledController, ExecutionContext } from '@cloudflare/workers-types'
import app from './worker'
import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '@prisma/client/edge';


interface Env {
  DEV_DATABASE_URL: string,
  DEV_JWT_SECRET: string,
  SMS_WEBHOOK_URL: string,
  
  PROD_DATABASE_URL: string,
  PROD_JWT_SECRET: string

}

export default {
  
  //cron trigger handler
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    try{
      console.log(`Cron triggered by: ${controller.cron}`);
  
      const prisma = new PrismaClient({
          datasourceUrl: env.PROD_DATABASE_URL,
        }).$extends(withAccelerate());
      
      //every day at 10:00 am IST (4:30 am UTC) cron = 30 4 * * *
      //fetch all allotments with end_date = today, and member.status=current
      //generate SMS body and insert those in SMS table
      if(controller.cron == "30 4 * * *" ){  
        const today = new Date();
        // Format today's date to remove the time component
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        // Fetch allotments with end_date equal to today's date
        const allotments = await prisma.allotment.findMany({
          where: {
            end_date: {
              gte: startOfDay, // Greater than or equal to start of the day
              lt: endOfDay,    // Less than the start of the next day
            },
          },
          include: {
            member: true, // Include member details if needed
          },
        });
        console.log(allotments)

        const smsData = allotments.map(allotment => {
          const smsBody = `Hello ${allotment.member.name}, your allotment for seat number ${allotment.seat_num} is ending on ${allotment.end_date.toDateString()}.`;
          
          return {
            member_id: allotment.member_id,
            sms_body: smsBody
          };
        });
      
        // Insert all generated SMS bodies into the SMS table
        await prisma.sms.createMany({
          data: smsData,
        })

        console.log("SMS added successfully")
      }

      //send SMS every 15 minutes
      else if(controller.cron == "*/15 3-16 * * *"){
        //fetch SMS
        const messages = await prisma.sms.findMany({
          where: {
            sent: false,
          },
          include: {
            member: {
              select:{
                name: true,
                phone_number: true
              }
            } // Include member details if needed
          },
          take: 5
        });
        
        if(messages.length > 0){
          
          //send those sms
          messages.map(msg => {
            const url = `https://trigger.macrodroid.com/67cad7d4-8247-4008-a010-40d3eb08bd80/sms?phNumber=${msg.member.phone_number}`;
            fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: msg.sms_body,
            })
          })
          
          //update sms sent= true
          const idsToUpdate = messages.map(msg => msg.id);
          
          await prisma.sms.updateMany({
            where: {
              id: { in: idsToUpdate },
            },
            data: {
              sent: true
            },
          });
      
          // Optional: Log or return updated records
          console.log('Updated SMS:', messages);
          
        }
      }


      //sms webhook test
      const url = "https://trigger.macrodroid.com/67cad7d4-8247-4008-a010-40d3eb08bd80/sms?phNumber=0";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: "From cron trigger",
      });
    
      console.log("cron triggerd job")
      // Perform any additional operations you need here
    } catch (error) {
      console.error('Error during database call:', error);
    } finally {
      // Ensure the client is closed after the operation to avoid resource leaks
      // await prisma.$disconnect();
    }
  },
  async fetch(request:Request, env: Env){
    return await app.fetch(request, env);
  }
}