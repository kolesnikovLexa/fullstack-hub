import { Router } from "express"

import { authMiddleware } from "../middleware/authMiddleware"
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../services/authService"

const router = Router()

router.post("/register", async (req, res) => {
  const { email, password } = req.body

  const user = await registerUser(email, password)

  return res.status(201).json({
    user,
  })
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body

  const result = await loginUser(email, password)

  return res.json(result)
})

// Middleware сначала проверяет JWT,
// после чего userId становится доступен через req.user.
router.get("/me", authMiddleware, async (req, res) => {
  const user = await getCurrentUser(req.user.userId)

  return res.json(user)
})

export default router
