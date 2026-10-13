import { describe, expect, it, vi } from "vitest"

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import { prisma } from "../prisma/db"
import { registerUser, loginUser } from "./authService"

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}))

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
  },
}))

describe("authService", () => {
  it("rejects invalid registration data", async () => {
    await expect(registerUser("invalid-email", "123")).rejects.toMatchObject({
      statusCode: 400,
      message: "Invalid registration data",
    })
  })

  it("rejects registration when user already exists", async () => {
    vi.spyOn(prisma, "query").mockResolvedValueOnce([{ id: 1 }])

    await expect(
      registerUser("test@example.com", "password123"),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "User already exists",
    })
  })

  it("rejects login with invalid password", async () => {
    vi.spyOn(prisma, "query").mockResolvedValueOnce([
      {
        id: 1,
        email: "test@example.com",
        password: "hashed-password",
      },
    ])

    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    await expect(
      loginUser("test@example.com", "wrong-password"),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid email or password",
    })

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "wrong-password",
      "hashed-password",
    )
  })

  it("logs in user and returns JWT", async () => {
    vi.spyOn(prisma, "query").mockResolvedValueOnce([
      {
        id: 1,
        email: "test@example.com",
        password: "hashed-password",
      },
    ])

    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
    vi.mocked(jwt.sign).mockReturnValue("test-token" as never)

    const result = await loginUser("test@example.com", "password123")

    expect(result).toEqual({
      token: "test-token",
      user: {
        id: 1,
        email: "test@example.com",
      },
    })

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: 1,
        email: "test@example.com",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    )
  })
})
