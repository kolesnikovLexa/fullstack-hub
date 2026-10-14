import "dotenv/config"
import app from "./app"
import { connectMongo } from "./db/mongo"

const PORT = 3000

async function startServer() {
  await connectMongo()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()
