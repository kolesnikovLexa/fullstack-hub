import { useState } from "react"
import { statuses } from "../../data/data"
import { validateTask } from "../../utils/validateTask"
import type {
  Task,
  TaskStatus,
  TaskErrors,
  TaskFormData,
} from "../../types/task"

type TaskFormProps = {
  onCreate: (task: TaskFormData) => void
  editingTask: Task | null
  updateTask: (taskId: string, changes: Partial<Task>) => void
  closeModal: () => void
}

function TaskForm({
  onCreate,
  editingTask,
  updateTask,
  closeModal,
}: TaskFormProps) {
  const [title, setTitle] = useState(editingTask?.title ?? "")
  const [description, setDescription] = useState(editingTask?.description ?? "")
  const [status, setStatus] = useState<Task["status"]>(
    editingTask?.status ?? "Planned",
  )
  const [errors, setErrors] = useState<TaskErrors>({})

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    setErrors({})

    const task = {
      title,
      status,
      description,
    }

    // Сначала проверяем данные формы.
    // Если есть ошибки — запрос на создание/изменение не отправляем.
    const validationErrors = validateTask(task)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Если editingTask отсутствует — создаём новую задачу.
    // Иначе сохраняем изменения существующей.
    if (editingTask === null) {
      onCreate({
        title,
        description,
        status,
      })
    } else {
      updateTask(editingTask.id, {
        title,
        description,
        status,
      })
    }

    closeModal()
  }

  return (
    <form className="newTaskForm" onSubmit={handleSubmit}>
      <div className="newTaskHeader">
        <input
          name="title"
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)

            // Убираем ошибку поля, как только пользователь
            // начинает исправлять введённое значение.
            setErrors((prevErrors) => ({
              ...prevErrors,
              title: "",
            }))
          }}
          placeholder="Task title"
        />

        {errors.title && <p>{errors.title}</p>}

        <select
          name="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as TaskStatus)}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <textarea
        name="description"
        value={description}
        onChange={(event) => {
          setDescription(event.target.value)

          setErrors((prevErrors) => ({
            ...prevErrors,
            description: "",
          }))
        }}
        placeholder="Task description"
        rows={4}
      />

      {errors.description && <p>{errors.description}</p>}

      <div className="formActions">
        <button type="button" onClick={closeModal}>
          Cancel
        </button>

        <button type="submit">
          {editingTask === null ? "Create task" : "Save"}
        </button>
      </div>
    </form>
  )
}

export default TaskForm
