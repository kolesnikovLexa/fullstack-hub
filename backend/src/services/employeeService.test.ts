import { describe, expect, it, vi } from "vitest"

import { prisma } from "../prisma/db"
import {
  createEmployee,
  getEmployeeById,
  updateEmployee,
} from "./employeeService"

describe("employeeService", () => {
  it("rejects invalid employee data", async () => {
    const invalidEmployee = {
      name: "A",
      email: "invalid-email",
      phone: "123",
      company: {
        name: "G",
      },
    }

    await expect(createEmployee(invalidEmployee)).rejects.toMatchObject({
      statusCode: 400,
      message: "Invalid employee data",
    })
  })

  it("throws 404 when employee does not exist", async () => {
    vi.spyOn(prisma, "query").mockResolvedValueOnce([])

    await expect(getEmployeeById("missing-id")).rejects.toMatchObject({
      statusCode: 404,
      message: "Employee not found",
    })
  })

  it("throws 400 when update has no changes", async () => {
    vi.spyOn(prisma, "query").mockResolvedValueOnce([{ id: "employee-id" }])

    await expect(updateEmployee("employee-id", {})).rejects.toMatchObject({
      statusCode: 400,
      message: "No changes provided",
    })
  })

  it("creates employee successfully", async () => {
    vi.spyOn(prisma, "query")
      .mockResolvedValueOnce([]) // company not found
      .mockResolvedValueOnce([
        {
          id: "company-id",
          name: "Google",
        },
      ])
      .mockResolvedValueOnce([
        {
          id: "employee-id",
          name: "John Doe",
          email: "john@example.com",
          phone: "123456789",
        },
      ])

    const result = await createEmployee({
      name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      company: {
        name: "Google",
      },
    })

    expect(result).toEqual({
      id: "employee-id",
      name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      company: {
        name: "Google",
      },
    })
  })

  it("returns existing employee", async () => {
    vi.spyOn(prisma, "query").mockResolvedValueOnce([
      {
        employeeId: "employee-id",
        employeeName: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        companyName: "Google",
      },
    ])

    const result = await getEmployeeById("employee-id")

    expect(result).toEqual({
      id: "employee-id",
      name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      company: {
        name: "Google",
      },
    })
  })
})
