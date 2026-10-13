import { z } from "zod"

export const employeeSchema = z.object({
  name: z.string().min(2, "Name must contain at least 2 characters"),
  email: z.email("Invalid email"),
  phone: z.string().min(5, "Phone is too short"),
  company: z.string().min(2, "Company name is too short"),
})

export type EmployeeFormData = z.infer<typeof employeeSchema>
