import { screen } from "@testing-library/react"
import { vi } from "vitest"

import { renderWithQueryClient } from "../../test/testUtils"
import EmployeeDetails from "./EmployeeDetails"
import userEvent from "@testing-library/user-event"
import { updateEmployee } from "../../api/employeeApi"

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  handleDeleteEmployee: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("../../api/employeeApi", () => ({
  getEmployee: vi.fn().mockResolvedValue({
    id: "test-id",
    name: "John Doe",
    email: "john@example.com",
    phone: "123456789",
    company: {
      name: "Google",
    },
  }),
  updateEmployee: vi.fn().mockResolvedValue({
    id: "test-id",
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "987654321",
    company: {
      name: "Microsoft",
    },
  }),
}))

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>("react-router-dom")

  return {
    ...actual,
    useParams: () => ({
      employeeId: "test-id",
    }),
    useOutletContext: () => ({
      handleDeleteEmployee: mocks.handleDeleteEmployee,
    }),
    useNavigate: () => mocks.navigate,
  }
})

describe("EmployeeDetails", () => {
  it("renders employee details", async () => {
    renderWithQueryClient(<EmployeeDetails />)

    expect(
      await screen.findByRole("heading", { name: "John Doe" }),
    ).toBeInTheDocument()
    expect(screen.getByText("john@example.com")).toBeInTheDocument()
    expect(screen.getByText("123456789")).toBeInTheDocument()
    expect(screen.getByText("Google")).toBeInTheDocument()
  })

  it("fills form with employee data when editing", async () => {
    const user = userEvent.setup()

    renderWithQueryClient(<EmployeeDetails />)

    await user.click(await screen.findByRole("button", { name: "Edit" }))

    expect(screen.getByLabelText("Name")).toHaveValue("John Doe")
    expect(screen.getByLabelText("Email")).toHaveValue("john@example.com")
    expect(screen.getByLabelText("Phone")).toHaveValue("123456789")
    expect(screen.getByLabelText("Company")).toHaveValue("Google")
  })

  it("updates employee when form is submitted", async () => {
    const user = userEvent.setup()

    renderWithQueryClient(<EmployeeDetails />)

    await user.click(await screen.findByRole("button", { name: "Edit" }))

    const nameInput = screen.getByLabelText("Name")

    await user.clear(nameInput)
    await user.type(nameInput, "Jane Doe")

    await user.click(screen.getByRole("button", { name: "Save" }))

    await vi.waitFor(() => {
      expect(updateEmployee).toHaveBeenCalledWith("test-id", {
        name: "Jane Doe",
        email: "john@example.com",
        phone: "123456789",
        company: "Google",
      })
    })

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument()
  })

  it("deletes employee and navigates to employees page", async () => {
    const user = userEvent.setup()

    renderWithQueryClient(<EmployeeDetails />)

    await user.click(await screen.findByRole("button", { name: "Delete" }))

    expect(mocks.handleDeleteEmployee).toHaveBeenCalledWith("test-id")
    expect(mocks.navigate).toHaveBeenCalledWith("/employees")
  })
})
