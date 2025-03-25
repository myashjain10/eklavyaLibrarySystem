import z from "zod";


// admin login
export const adminSchema = z.object({
  admin_name: z.string(),
  password: z.string().min(10)
})

export const adminLoginSchema = z.object({
  admin_name: z.string(),
  old_password: z.string().min(10),
  new_password: z.string().min(10)
})




// member creation schema
export const memberSchema = z.object({
  name: z.string(),
  phone_number: z.string().min(10).max(10),
  email: z.string().email().optional(),
  status: z.enum(["current", "previous"]).optional()
})

//allotment creation schema
export const allotmentSchema = z.object({
    member_id: z.string(),
    seat_num: z.number().min(1).max(100),
    start_date: z.string().date(),
    end_date: z.string().date(),
    full_day: z.boolean(),
    first_half: z.boolean(),
    second_half: z.boolean(),
})

