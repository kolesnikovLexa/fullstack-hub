export type TaskStatus = "Planned" | "In progress" | "Completed"

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
}

export type CreateTask = Omit<Task, "id">
