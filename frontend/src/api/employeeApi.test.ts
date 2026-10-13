import { describe, it, expect, vi, beforeEach } from "vitest"

import { getEmployees } from "./employeeApi"

describe("getEmployees", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("returns employees when request succeeds", async () => {
    const employees = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        company: {
          name: "Google",
        },
      },
    ]

    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify(employees), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    )

    const result = await getEmployees()

    expect(result).toEqual(employees)
  })

  it("throws an error when request fails", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Server error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    )

    await expect(getEmployees()).rejects.toThrow("Server error")
  })
})
