import { AuthPayload } from "./types/types"

declare global {
  namespace Express {
    interface Request {
      user: AuthPayload
    }
  }
}

export {}
