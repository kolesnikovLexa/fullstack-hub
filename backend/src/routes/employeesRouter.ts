import { Router } from "express"
import { authMiddleware } from "../middleware/authMiddleware"
import type { Request } from "express"
import type { ParamsDictionary } from "express-serve-static-core"
import type { CreateEmployee } from "../types/employee"
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employeeService"

const router = Router()

// Все endpoints сотрудников требуют авторизации.
router.use(authMiddleware)

// Получить всех сотрудников.
router.get("/", async (req, res) => {
  const employees = await getEmployees()

  return res.json(employees)
})

// Получить одного сотрудника по UUID.
router.get("/:id", async (req, res) => {
  const employee = await getEmployeeById(req.params.id)

  return res.json(employee)
})

// Создать сотрудника.
router.post(
  "/",
  async (req: Request<ParamsDictionary, unknown, CreateEmployee>, res) => {
    const employee = await createEmployee(req.body)

    return res.status(201).json(employee)
  },
)

// Обновить сотрудника.
router.patch("/:id", async (req, res) => {
  const employee = await updateEmployee(req.params.id, req.body)

  return res.json(employee)
})

// Удалить сотрудника.
router.delete("/:id", async (req, res) => {
  await deleteEmployee(req.params.id)

  return res.status(204).send()
})

export default router
