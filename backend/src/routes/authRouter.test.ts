import request from "supertest"
import { describe, expect, it, vi } from "vitest"
import jwt from "jsonwebtoken"

import app from "../index"
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../services/authService"

vi.mock("../services/authService", () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  getCurrentUser: vi.fn(),
}))

describe("Auth API", () => {
  const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET!)

  it("registers a new user", async () => {
    vi.mocked(registerUser).mockResolvedValue({
      id: 1,
      email: "test@example.com",
    } as Awaited<ReturnType<typeof registerUser>>)

    const response = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
    })

    expect(response.status).toBe(201)

    expect(response.body).toEqual({
      user: {
        id: 1,
        email: "test@example.com",
      },
    })

    expect(registerUser).toHaveBeenCalledWith("test@example.com", "password123")
  })

  it("logs in user", async () => {
    vi.mocked(loginUser).mockResolvedValue({
      token: "test-token",
      user: {
        id: 1,
        email: "test@example.com",
      },
    } as Awaited<ReturnType<typeof loginUser>>)

    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    })

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      token: "test-token",
      user: {
        id: 1,
        email: "test@example.com",
      },
    })

    expect(loginUser).toHaveBeenCalledWith("test@example.com", "password123")
  })

  it("returns current user with valid token", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: 1,
      email: "test@example.com",
    } as Awaited<ReturnType<typeof registerUser>>)

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      id: 1,
      email: "test@example.com",
    })

    expect(getCurrentUser).toHaveBeenCalledWith(1)
  })
})
