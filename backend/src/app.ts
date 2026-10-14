import "dotenv/config"
import express from "express"
import cors from "cors"

import employeeRouter from "./routes/employeesRouter"
import authRouter from "./routes/authRouter"
import { errorHandler } from "./middleware/errorHandler"
import taskRouter from "./routes/tasksRouter"
import settingsRouter from "./routes/settingsRouter"

const app = express()

app.use(cors())
app.use(express.json())

// Подключаем API-маршруты.
app.use("/api/employees", employeeRouter)
app.use("/api/auth", authRouter)
app.use("/api/tasks", taskRouter)
app.use("/api/settings", settingsRouter)

// Единая обработка ошибок.
app.use(errorHandler)

export default app
