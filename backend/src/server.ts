import app from "./index"
import { connectMongo } from "./db/mongo"

const PORT = 3000

async function startServer() {
  await connectMongo()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()
