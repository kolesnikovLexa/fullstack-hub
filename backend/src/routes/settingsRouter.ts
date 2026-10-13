import { Router } from "express"

import { authMiddleware } from "../middleware/authMiddleware"
import { getSettings, updateSettings } from "../services/settingsService"

const settingsRouter = Router()

settingsRouter.get("/", authMiddleware, async (req, res) => {
  const settings = await getSettings(req.user.userId)

  return res.json(settings)
})

settingsRouter.put("/", authMiddleware, async (req, res) => {
  const settings = await updateSettings(req.user.userId, req.body)

  return res.json(settings)
})

export default settingsRouter
