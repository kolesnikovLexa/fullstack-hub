import { Router } from "express"

import { authMiddleware } from "../middleware/authMiddleware"
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService"

import type { CreateTask } from "../types/task"

const router = Router()

// Все операции с задачами требуют авторизации.
router.use(authMiddleware)

// Получить задачи текущего пользователя.
router.get("/", async (req, res) => {
  const tasks = await getTasks(req.user.userId)

  return res.json(tasks)
})

// Получить одну задачу текущего пользователя.
router.get("/:id", async (req, res) => {
  const task = await getTaskById(req.params.id, req.user.userId)

  return res.json(task)
})

// Создать задачу для текущего пользователя.
router.post("/", async (req, res) => {
  const task = await createTask(req.user.userId, req.body as CreateTask)

  return res.status(201).json(task)
})

// Обновить свою задачу.
router.patch("/:id", async (req, res) => {
  const task = await updateTask(req.params.id, req.user.userId, req.body)

  return res.json(task)
})

// Удалить свою задачу.
router.delete("/:id", async (req, res) => {
  await deleteTask(req.params.id, req.user.userId)

  return res.status(204).send()
})

export default router
