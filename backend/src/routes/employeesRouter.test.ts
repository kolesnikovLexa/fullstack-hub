import request from "supertest"
import { describe, expect, it, vi } from "vitest"
import jwt from "jsonwebtoken"

import app from "../app"
import { createEmployee } from "../services/employeeService"

vi.mock("../services/employeeService", () => ({
  getEmployees: vi.fn(),
  getEmployeeById: vi.fn(),
  createEmployee: vi.fn(),
  updateEmployee: vi.fn(),
  deleteEmployee: vi.fn(),
}))

process.env.JWT_SECRET ??= "test-secret"

describe("Employees API", () => {
  const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET!)

  it("returns 401 when authorization token is missing", async () => {
    const response = await request(app).get("/api/employees")

    expect(response.status).toBe(401)
  })

  it("returns 401 when token is invalid", async () => {
    const response = await request(app)
      .get("/api/employees")
      .set("Authorization", "Bearer invalid-token")

    expect(response.status).toBe(401)
  })

  it("allows request with valid token", async () => {
    const response = await request(app)
      .get("/api/employees")
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).not.toBe(401)
  })

  it("creates employee and returns 201", async () => {
    vi.mocked(createEmployee).mockResolvedValue({
      id: "test-id",
      name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      company: {
        name: "Google",
      },
    } as Awaited<ReturnType<typeof createEmployee>>)

    const employee = {
      name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      company: {
        name: "Google",
      },
    }

    const response = await request(app)
      .post("/api/employees")
      .set("Authorization", `Bearer ${token}`)
      .send(employee)

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      id: "test-id",
      name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      company: {
        name: "Google",
      },
    })

    expect(createEmployee).toHaveBeenCalledWith(employee)
  })
})
