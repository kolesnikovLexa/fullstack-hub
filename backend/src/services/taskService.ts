import { db, prisma } from "../prisma/db"
import { AppError } from "../errors/AppError"
import type { TaskStatus } from "../types/task"

// Получить все задачи текущего пользователя.
export async function getTasks(userId: number) {
  return prisma.query(
    db.sql.public.tasks
      .select("id", "title", "description", "status")
      .where((f, fns) => fns.eq(f.user_id, Number(userId)))
      .build(),
  )
}

// Получить одну задачу текущего пользователя.
export async function getTaskById(taskId: string, userId: number) {
  const result = await prisma.query(
    db.sql.public.tasks
      .select("id", "title", "description", "status")
      .where((f, fns) =>
        fns.and(fns.eq(f.id, taskId), fns.eq(f.user_id, Number(userId))),
      )
      .build(),
  )

  if (result.length === 0) {
    throw new AppError(404, "Task not found")
  }

  return result[0]
}

// Создать задачу для текущего пользователя.
export async function createTask(
  userId: number,
  data: {
    title: string
    description: string
    status: TaskStatus
  },
) {
  const result = await prisma.query(
    db.sql.public.tasks
      .insert([
        {
          id: crypto.randomUUID(),
          title: data.title,
          description: data.description,
          status: data.status,
          user_id: Number(userId),
        },
      ])
      .returning("id", "title", "description", "status")
      .build(),
  )

  return result[0]
}

// Обновить только свою задачу.
export async function updateTask(
  taskId: string,
  userId: number,
  changes: Partial<{
    title: string
    description: string
    status: TaskStatus
  }>,
) {
  // user_id участвует в условии, поэтому нельзя изменить
  // задачу другого пользователя, даже зная её UUID.
  const result = await prisma.query(
    db.sql.public.tasks
      .update(changes)
      .where((f, fns) =>
        fns.and(fns.eq(f.id, taskId), fns.eq(f.user_id, Number(userId))),
      )
      .returning("id", "title", "description", "status")
      .build(),
  )

  if (result.length === 0) {
    throw new AppError(404, "Task not found")
  }

  return result[0]
}

// Удалить только свою задачу.
export async function deleteTask(taskId: string, userId: number) {
  const result = await prisma.query(
    db.sql.public.tasks
      .delete()
      .where((f, fns) =>
        fns.and(fns.eq(f.id, taskId), fns.eq(f.user_id, Number(userId))),
      )
      .returning("id")
      .build(),
  )

  if (result.length === 0) {
    throw new AppError(404, "Task not found")
  }
}
