import { useEffect, useState } from "react"

import TaskForm from "./TaskForm"
import Modal from "../../components/ui/Modal"
import DashboardHeader from "./DashboardHeader"
import DashboardMain from "./DashboardMain"

import {
  getTasks,
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
} from "../../api/taskApi"

import { statuses } from "../../data/data"

import type { Task, TaskStatus, TaskFormData } from "../../types/task"

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // tasks теперь приходят с сервера.
  // localStorage больше не используется как хранилище задач.
  const [tasks, setTasks] = useState<Task[]>([])

  // Ошибка загрузки задач отображается в интерфейсе,
  // а не остаётся только в консоли браузера.
  const [error, setError] = useState("")

  // Загружаем задачи текущего пользователя после открытия Dashboard.
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await getTasks()
        setTasks(tasks)
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load tasks",
        )
      }
    }

    loadTasks()
  }, [])

  // Создаём задачу на сервере и добавляем
  // полученную от сервера задачу в состояние.
  const createTask = async (taskData: TaskFormData) => {
    try {
      setError("")

      const newTask = await createTaskApi(taskData)

      setTasks((prev) => [...prev, newTask])
      setEditingTask(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create task")
    }
  }

  // Удаляем задачу на сервере и только после успешного
  // ответа убираем её из состояния интерфейса.
  const deleteTask = async (taskId: Task["id"]) => {
    try {
      setError("")

      await deleteTaskApi(taskId)

      setTasks((prev) => prev.filter((task) => task.id !== taskId))
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete task")
    }
  }

  // Обновляем задачу на сервере и заменяем её
  // актуальной версией из ответа сервера.
  const updateTask = async (taskId: Task["id"], changes: Partial<Task>) => {
    try {
      setError("")

      const updatedTask = await updateTaskApi(taskId, changes)

      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task)),
      )
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update task")
    }
  }

  const editTask = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openNewTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  // Поиск работает только с уже загруженными задачами.
  // Для него отдельный запрос к серверу не нужен.
  const [search, setSearch] = useState("")

  const filteredTasks = tasks.filter((task) => {
    const searchText = search.toLowerCase()

    return (
      task.title.toLowerCase().includes(searchText) ||
      task.description.toLowerCase().includes(searchText)
    )
  })

  const searchOnChange = (value: string) => {
    setSearch(value)
  }

  // Фильтр статусов — состояние интерфейса,
  // поэтому он остаётся на frontend.
  const [statusFilter, setStatusFilter] = useState<TaskStatus[]>([...statuses])

  const visibleStatuses = statuses.filter((status) =>
    statusFilter.includes(status),
  )

  const statusFilterOnChange = (status: TaskStatus, checked: boolean) => {
    if (checked) {
      setStatusFilter((prev) => [...prev, status])
    } else {
      setStatusFilter((prev) => prev.filter((item) => item !== status))
    }
  }

  const statusFilterAllOnChange = (checked: boolean) => {
    if (checked) {
      setStatusFilter(statuses)
    } else {
      setStatusFilter([])
    }
  }

  return (
    <section className="dashboard">
      <DashboardHeader
        taskCount={tasks.length}
        onNewTask={openNewTask}
        statusFilter={statusFilter}
        statuses={statuses}
        onStatusFilterChange={statusFilterOnChange}
        onStatusFilterAllChange={statusFilterAllOnChange}
        search={search}
        onSearchChange={searchOnChange}
      />

      {error && <p className="errorMessage">{error}</p>}

      {isModalOpen && (
        <Modal>
          <TaskForm
            key={editingTask?.id ?? "new"}
            onCreate={createTask}
            editingTask={editingTask}
            updateTask={updateTask}
            closeModal={closeModal}
          />
        </Modal>
      )}

      <DashboardMain
        visibleStatuses={visibleStatuses}
        filteredTasks={filteredTasks}
        deleteTask={deleteTask}
        updateTask={updateTask}
        editTask={editTask}
      />
    </section>
  )
}

export default Dashboard
