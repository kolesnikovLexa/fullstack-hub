import request from "supertest"
import { describe, expect, it, vi } from "vitest"
import jwt from "jsonwebtoken"

import app from "../index"
import { getTasks, createTask, deleteTask } from "../services/taskService"

vi.mock("../services/taskService", () => ({
  getTasks: vi.fn(),
  getTaskById: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}))

describe("Tasks API", () => {
  const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET!)

  it("returns tasks for current user", async () => {
    vi.mocked(getTasks).mockResolvedValue([
      {
        id: "task-1",
        title: "Learn testing",
        status: "Planned",
      },
    ] as Awaited<ReturnType<typeof getTasks>>)

    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual([
      {
        id: "task-1",
        title: "Learn testing",
        status: "Planned",
      },
    ])

    expect(getTasks).toHaveBeenCalledWith(1)
  })

  it("creates task for current user", async () => {
    const task = {
      title: "Learn testing",
      status: "Planned",
    }

    vi.mocked(createTask).mockResolvedValue({
      id: "task-1",
      ...task,
    } as Awaited<ReturnType<typeof createTask>>)

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send(task)

    expect(response.status).toBe(201)

    expect(response.body).toEqual({
      id: "task-1",
      ...task,
    })

    expect(createTask).toHaveBeenCalledWith(1, task)
  })

  it("deletes task for current user", async () => {
    vi.mocked(deleteTask).mockResolvedValue(undefined)

    const response = await request(app)
      .delete("/api/tasks/task-1")
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(204)

    expect(deleteTask).toHaveBeenCalledWith("task-1", 1)
  })
})
