import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import { renderWithQueryClient } from "../../test/testUtils"
import EmployeeForm from "./EmployeeForm"

vi.mock("../../api/employeeApi", () => ({
  createEmployee: vi.fn().mockResolvedValue({
    id: "test-id",
    name: "John Doe",
    email: "john@example.com",
    phone: "123456789",
    company: {
      name: "Google",
    },
  }),
}))
describe("EmployeeForm", () => {
  it("renders all form fields", () => {
    renderWithQueryClient(<EmployeeForm onClose={() => {}} />)

    expect(screen.getByLabelText("Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Phone")).toBeInTheDocument()
    expect(screen.getByLabelText("Company")).toBeInTheDocument()
  })

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<EmployeeForm onClose={() => {}} />)

    await user.click(screen.getByRole("button", { name: "Create employee" }))

    expect(
      await screen.findByText("Name must contain at least 2 characters"),
    ).toBeInTheDocument()

    expect(screen.getByText("Invalid email")).toBeInTheDocument()
    expect(screen.getByText("Phone is too short")).toBeInTheDocument()
    expect(screen.getByText("Company name is too short")).toBeInTheDocument()
  })

  it("submits valid form data", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    renderWithQueryClient(<EmployeeForm onClose={onClose} />)

    await user.type(screen.getByLabelText("Name"), "John Doe")
    await user.type(screen.getByLabelText("Email"), "john@example.com")
    await user.type(screen.getByLabelText("Phone"), "123456789")
    await user.type(screen.getByLabelText("Company"), "Google")

    await user.click(screen.getByRole("button", { name: "Create employee" }))

    await vi.waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })
})
