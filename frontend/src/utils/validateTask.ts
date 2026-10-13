import type { TaskFormData, TaskErrors } from "../types/task"

export const validateTask = (task: TaskFormData) => {
  const errors: TaskErrors = {}

  if (task.title.trim() === "") {
    errors.title = "Title is required"
  }

  if (task.description.trim() === "") {
    errors.description = "Description is required"
  }

  return errors
}
