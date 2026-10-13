import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import type { Employee } from "../../types/employee"

import { getEmployee, updateEmployee } from "../../api/employeeApi"
import { employeeKeys } from "../../queries/employeeQueries"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useState } from "react"

const employeeSchema = z.object({
  name: z.string().min(2, "Name must contain at least 2 characters"),
  email: z.email("Invalid email"),
  phone: z.string().min(5, "Phone is too short"),
  company: z.string().min(2, "Company name is too short"),
})

type EmployeeFormData = z.infer<typeof employeeSchema>

function EmployeeDetails() {
  const { employeeId } = useParams<{ employeeId: string }>()

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  })

  const {
    data: employee,
    isPending,
    error,
  } = useQuery({
    queryKey: employeeKeys.detail(employeeId!),
    queryFn: () => getEmployee(employeeId!),
    enabled: !!employeeId,
  })

  const { handleDeleteEmployee } = useOutletContext<{
    handleDeleteEmployee: (id: string) => Promise<void>
  }>()

  function handleEdit(employee: Employee) {
    // Заполняем RHF текущими данными сотрудника перед открытием формы.
    reset({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      company: employee.company.name,
    })

    setIsEditing(true)
  }

  const updateEmployeeMutation = useMutation({
    mutationFn: ({
      employeeId,
      changes,
    }: {
      employeeId: string
      changes: EmployeeFormData
    }) => updateEmployee(employeeId, changes),

    onSuccess: () => {
      setIsEditing(false)

      queryClient.invalidateQueries({
        queryKey: employeeKeys.all,
      })
    },
  })

  function onSubmit(formData: EmployeeFormData) {
    if (!employee) {
      return
    }

    updateEmployeeMutation.mutate({
      employeeId: employee.id,
      changes: formData,
    })
  }

  if (error) {
    return <h1>{error.message}</h1>
  }

  if (isPending) {
    return <h1>Loading...</h1>
  }

  return (
    <main className="employee">
      <h1>{employee.name}</h1>

      {isEditing ? (
        <form className="employeeForm" onSubmit={handleSubmit(onSubmit)}>
          <label>
            Name
            <input {...register("name")} />
            {errors.name && <p>{errors.name.message}</p>}
          </label>

          <label>
            Email
            <input {...register("email")} />
            {errors.email && <p>{errors.email.message}</p>}
          </label>

          <label>
            Phone
            <input {...register("phone")} />
            {errors.phone && <p>{errors.phone.message}</p>}
          </label>

          <label>
            Company
            <input {...register("company")} />
            {errors.company && <p>{errors.company.message}</p>}
          </label>

          {updateEmployeeMutation.error && (
            <p>{updateEmployeeMutation.error.message}</p>
          )}

          <div className="formActions">
            <button
              className="secondaryButton"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>

            <button
              className="primaryButton"
              type="submit"
              disabled={updateEmployeeMutation.isPending}
            >
              {updateEmployeeMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      ) : (
        <div className="employeeInfo">
          <p>
            <strong>Name:</strong> {employee.name}
          </p>

          <p>
            <strong>Email:</strong> {employee.email}
          </p>

          <p>
            <strong>Phone:</strong> {employee.phone}
          </p>

          <p>
            <strong>Company:</strong> {employee.company.name}
          </p>
        </div>
      )}

      {!isEditing && (
        <button
          className="secondaryButton"
          onClick={() => handleEdit(employee)}
        >
          Edit
        </button>
      )}

      <button
        className="secondaryButton"
        onClick={async () => {
          await handleDeleteEmployee(employee.id)
          navigate("/employees")
        }}
      >
        Delete
      </button>
    </main>
  )
}

export default EmployeeDetails
