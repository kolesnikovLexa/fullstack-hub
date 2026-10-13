import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { createEmployee } from "../../api/employeeApi"
import { employeeKeys } from "../../queries/employeeQueries"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  employeeSchema,
  type EmployeeFormData,
} from "../../schemas/employeeSchema"

type EmployeeFormProps = {
  onClose: () => void
}

function EmployeeForm({ onClose }: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  })
  const queryClient = useQueryClient()

  const createEmployeeMutation = useMutation({
    mutationFn: createEmployee,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.all,
      })

      onClose()
    },
  })

  function onSubmit(formData: EmployeeFormData) {
    createEmployeeMutation.mutate(formData)
  }

  return (
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

      {createEmployeeMutation.error && (
        <p>{createEmployeeMutation.error.message}</p>
      )}

      <div className="formActions">
        <button className="secondaryButton" type="button" onClick={onClose}>
          Cancel
        </button>

        <button
          className="primaryButton"
          type="submit"
          disabled={createEmployeeMutation.isPending}
        >
          {createEmployeeMutation.isPending ? "Creating..." : "Create employee"}
        </button>
      </div>
    </form>
  )
}

export default EmployeeForm
