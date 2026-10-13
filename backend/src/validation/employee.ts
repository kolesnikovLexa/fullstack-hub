import { z } from "zod"

export const employeeSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  company: z.object({
    name: z.string().min(1),
  }),
})
