export type Employee = {
  id: string
  name: string
  email: string
  phone: string
  company: {
    name: string
  }
}

export type CreateEmployee = Omit<Employee, "id">
