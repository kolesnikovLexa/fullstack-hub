import type { Employee, EmployeeFormData } from "../types/employee"
import { apiFetch } from "../utils/apiFetch"
import { getApiError } from "../utils/getApiError"

// Общая обработка ошибок API для employee-запросов.
async function handleError(response: Response): Promise<never> {
  const errorData = await response.json()

  throw new Error(getApiError(errorData))
}

// Получить всех сотрудников.
export async function getEmployees(): Promise<Employee[]> {
  const response = await apiFetch("/employees")

  if (!response.ok) {
    return handleError(response)
  }

  return response.json()
}

// Получить одного сотрудника.
export async function getEmployee(
  employeeId: Employee["id"],
): Promise<Employee> {
  const response = await apiFetch(`/employees/${employeeId}`)

  if (!response.ok) {
    return handleError(response)
  }

  return response.json()
}

// Создать сотрудника.
export async function createEmployee(
  employeeData: EmployeeFormData,
): Promise<Employee> {
  const response = await apiFetch("/employees", {
    method: "POST",
    body: JSON.stringify({
      ...employeeData,
      company: {
        name: employeeData.company,
      },
    }),
  })

  if (!response.ok) {
    return handleError(response)
  }

  return response.json()
}

// Обновить сотрудника.
export async function updateEmployee(
  employeeId: Employee["id"],
  changes: EmployeeFormData,
): Promise<Employee> {
  const response = await apiFetch(`/employees/${employeeId}`, {
    method: "PATCH",
    body: JSON.stringify({
      ...changes,
      company: {
        name: changes.company,
      },
    }),
  })

  if (!response.ok) {
    return handleError(response)
  }

  return response.json()
}

// Удалить сотрудника.
export async function deleteEmployee(
  employeeId: Employee["id"],
): Promise<void> {
  const response = await apiFetch(`/employees/${employeeId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    return handleError(response)
  }
}
