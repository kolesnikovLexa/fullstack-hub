import { NavLink, Outlet } from "react-router-dom"
import { useState } from "react"

import EmployeeForm from "./EmployeeForm"
import Modal from "../../components/ui/Modal"

import { getEmployees, deleteEmployee } from "../../api/employeeApi"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { employeeKeys } from "../../queries/employeeQueries"

function Employees() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const {
    data: employees = [],
    isPending,
    error,
  } = useQuery({
    queryKey: employeeKeys.all,
    queryFn: getEmployees,
  })

  const queryClient = useQueryClient()

  const deleteEmployeeMutation = useMutation({
    mutationFn: deleteEmployee,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.all,
      })
    },
  })

  function handleDeleteEmployee(id: string) {
    return deleteEmployeeMutation.mutateAsync(id)
  }

  if (error) {
    return <h1>{error.message}</h1>
  }

  if (isPending) {
    return <h1>Loading...</h1>
  }

  return (
    <main className="employees">
      <div className="employeesHeader">
        <h1>Employees</h1>

        <button className="primaryButton" onClick={() => setIsFormOpen(true)}>
          + Add employee
        </button>
      </div>

      {isFormOpen && (
        <Modal>
          <EmployeeForm onClose={() => setIsFormOpen(false)} />
        </Modal>
      )}

      <div className="employeesLayout">
        <div className="employeesList">
          {employees.map((employee) => (
            <NavLink key={employee.id} to={`/employees/${employee.id}`}>
              {employee.name}
            </NavLink>
          ))}
        </div>

        <Outlet
          context={{
            handleDeleteEmployee,
          }}
        />
      </div>
    </main>
  )
}

export default Employees
