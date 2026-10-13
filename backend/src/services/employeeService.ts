import { db, prisma } from "../prisma/db"
import { AppError } from "../errors/AppError"
import { employeeSchema } from "../validation/employee"
import type { CreateEmployee } from "../types/employee"

// Находим существующую компанию или создаём новую.
// Это используется и при создании, и при редактировании сотрудника.
async function getOrCreateCompany(name: string) {
  const companies = await prisma.query(
    db.sql.public.companies
      .select("id", "name")
      .where((f, fns) => fns.eq(f.name, name))
      .build(),
  )

  if (companies.length > 0) {
    return companies[0]
  }

  const newCompany = await prisma.query(
    db.sql.public.companies
      .insert([
        {
          id: crypto.randomUUID(),
          name,
        },
      ])
      .returning("id", "name")
      .build(),
  )

  return newCompany[0]
}

// Преобразуем результат JOIN из базы
// в структуру Employee, которую ожидает frontend.
function mapEmployee(employee: {
  employeeId: string
  employeeName: string
  email: string
  phone: string
  companyName: string
}) {
  return {
    id: employee.employeeId,
    name: employee.employeeName,
    email: employee.email,
    phone: employee.phone,
    company: {
      name: employee.companyName,
    },
  }
}

// Получить всех сотрудников вместе с названием компании.
export async function getEmployees() {
  const result = await prisma.query(
    db.sql.public.employees
      .innerJoin(db.sql.public.companies, (f, fns) =>
        fns.eq(f.employees.company_id, f.companies.id),
      )
      .select((f) => ({
        employeeId: f.employees.id,
        employeeName: f.employees.name,
        email: f.employees.email,
        phone: f.employees.phone,
        companyName: f.companies.name,
      }))
      .build(),
  )

  return result.map(mapEmployee)
}

// Получить одного сотрудника по UUID.
export async function getEmployeeById(id: string) {
  const result = await prisma.query(
    db.sql.public.employees
      .innerJoin(db.sql.public.companies, (f, fns) =>
        fns.eq(f.employees.company_id, f.companies.id),
      )
      .select((f) => ({
        employeeId: f.employees.id,
        employeeName: f.employees.name,
        email: f.employees.email,
        phone: f.employees.phone,
        companyName: f.companies.name,
      }))
      .where((f, fns) => fns.eq(f.employees.id, id))
      .build(),
  )

  if (result.length === 0) {
    throw new AppError(404, "Employee not found")
  }

  return mapEmployee(result[0])
}

// Создать нового сотрудника.
export async function createEmployee(data: CreateEmployee) {
  // Проверяем реальные данные, пришедшие от клиента.
  const validation = employeeSchema.safeParse(data)

  if (!validation.success) {
    throw new AppError(400, "Invalid employee data", validation.error.issues)
  }

  const { name, email, phone, company } = validation.data

  // Получаем ID существующей компании
  // или создаём новую.
  const companyRecord = await getOrCreateCompany(company.name)

  const employeeResult = await prisma.query(
    db.sql.public.employees
      .insert([
        {
          id: crypto.randomUUID(),
          name,
          email,
          phone,
          company_id: companyRecord.id,
        },
      ])
      .returning("id", "name", "email", "phone")
      .build(),
  )

  return {
    id: employeeResult[0].id,
    name: employeeResult[0].name,
    email: employeeResult[0].email,
    phone: employeeResult[0].phone,
    company: {
      name: companyRecord.name,
    },
  }
}

// Частично обновить данные сотрудника.
export async function updateEmployee(
  id: string,
  changes: Partial<CreateEmployee>,
) {
  // Сначала убеждаемся, что такой сотрудник существует.
  const existing = await prisma.query(
    db.sql.public.employees
      .select("id")
      .where((f, fns) => fns.eq(f.id, id))
      .build(),
  )

  if (existing.length === 0) {
    throw new AppError(404, "Employee not found")
  }

  // Для PATCH все поля необязательные.
  const validation = employeeSchema.partial().safeParse(changes)

  if (!validation.success) {
    throw new AppError(400, "Invalid employee data", validation.error.issues)
  }

  const data = validation.data

  // Формируем объект только из тех полей,
  // которые действительно нужно изменить.
  const updateData: {
    name?: string
    email?: string
    phone?: string
    company_id?: string
  } = {}

  if (data.name !== undefined) {
    updateData.name = data.name
  }

  if (data.email !== undefined) {
    updateData.email = data.email
  }

  if (data.phone !== undefined) {
    updateData.phone = data.phone
  }

  if (data.company !== undefined) {
    const company = await getOrCreateCompany(data.company.name)
    updateData.company_id = company.id
  }

  // PATCH с пустым объектом не должен ничего менять.
  if (Object.keys(updateData).length === 0) {
    throw new AppError(400, "No changes provided")
  }

  await prisma.query(
    db.sql.public.employees
      .update(updateData)
      .where((f, fns) => fns.eq(f.id, id))
      .build(),
  )

  // Возвращаем уже обновлённого сотрудника
  // в том же формате, что и GET.
  return getEmployeeById(id)
}

// Удалить сотрудника по UUID.
export async function deleteEmployee(id: string) {
  const result = await prisma.query(
    db.sql.public.employees
      .delete()
      .where((f, fns) => fns.eq(f.id, id))
      .returning("id")
      .build(),
  )

  if (result.length === 0) {
    throw new AppError(404, "Employee not found")
  }
}
