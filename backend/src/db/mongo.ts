import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("MONGODB_URI is not defined")
}

const client = new MongoClient(uri)

export const mongoDb = client.db("fullstack_interview")

export async function connectMongo() {
  await client.connect()
  await mongoDb.command({ ping: 1 })

  console.log("MongoDB connected")
}
