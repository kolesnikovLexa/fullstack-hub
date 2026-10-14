import { MongoClient, type Db } from "mongodb"

let client: MongoClient | undefined
let database: Db | undefined

export function getMongoDb(): Db {
  if (!database) {
    const uri = process.env.MONGODB_URI

    if (!uri) {
      throw new Error("MONGODB_URI is not defined")
    }

    client = new MongoClient(uri)
    database = client.db("fullstack_interview")
  }

  return database
}

export async function connectMongo() {
  const db = getMongoDb()

  await client!.connect()
  await db.command({ ping: 1 })

  console.log("MongoDB connected")
}
