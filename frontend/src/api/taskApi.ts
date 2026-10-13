import type { Task, TaskFormData } from "../types/task"
import { apiFetch } from "../utils/apiFetch"
import { getApiError } from "../utils/getApiError"

// Получаем сообщение об ошибке от backend.
async function handleError(response: Response): Promise<never> {
  const errorData = await response.json()

  throw new Error(getApiError(errorData))
}

// Получить задачи текущего пользователя.
export async function getTasks(): Promise<Task[]> {
  const response = await apiFetch("/tasks")

  if (!response.ok) {
    return handleError(response)
  }

  return response.json()
}

// Создать новую задачу.
export async function createTask(taskData: TaskFormData): Promise<Task> {
  const response = await apiFetch("/tasks", {
    method: "POST",
    body: JSON.stringify(taskData),
  })

  if (!response.ok) {
    return handleError(response)
  }

  return response.json()
}

// Обновить существующую задачу.
export async function updateTask(
  taskId: Task["id"],
  changes: Partial<Task>,
): Promise<Task> {
  const response = await apiFetch(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  })

  if (!response.ok) {
    return handleError(response)
  }

  return response.json()
}

// Удалить задачу.
export async function deleteTask(taskId: Task["id"]): Promise<void> {
  const response = await apiFetch(`/tasks/${taskId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    return handleError(response)
  }
}
