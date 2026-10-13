import type { Task, TaskStatus } from "../../types/task"
import Column from "./Column"

type DashboardMainProps = {
  visibleStatuses: TaskStatus[]
  filteredTasks: Task[]
  deleteTask: (taskId: Task["id"]) => void
  updateTask: (taskId: Task["id"], changes: Partial<Task>) => void
  editTask: (task: Task) => void
}

function DashboardMain({
  visibleStatuses,
  filteredTasks,
  deleteTask,
  updateTask,
  editTask,
}: DashboardMainProps) {
  return (
    <section className="dashboardMain">
      {visibleStatuses.map((status) => (
        <Column
          key={status}
          status={status}
          taskList={filteredTasks}
          deleteTask={deleteTask}
          updateTask={updateTask}
          editTask={editTask}
        />
      ))}
    </section>
  )
}

export default DashboardMain
