import "dotenv/config"
import express from "express"
import cors from "cors"

import employeeRouter from "./routes/employeesRouter"
import authRouter from "./routes/authRouter"
import { errorHandler } from "./middleware/errorHandler"
import taskRouter from "./routes/tasksRouter"
import settingsRouter from "./routes/settingsRouter"
import { connectMongo } from "./db/mongo"

const app = express()

app.use(cors())
app.use(express.json())

// Подключаем API-маршруты.
// Сама бизнес-логика находится в services.
app.use("/api/employees", employeeRouter)
app.use("/api/auth", authRouter)
app.use("/api/tasks", taskRouter)
app.use("/api/settings", settingsRouter)

// Все необработанные ошибки проходят через единый обработчик.
app.use(errorHandler)

export default app

const PORT = 3000

async function startServer() {
  await connectMongo()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()
