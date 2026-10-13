import type { TaskStatus } from "../../types/task"

type DashboardHeaderProps = {
  taskCount: number
  onNewTask: () => void
  statusFilter: TaskStatus[]
  statuses: TaskStatus[]
  onStatusFilterChange: (status: TaskStatus, checked: boolean) => void
  onStatusFilterAllChange: (checked: boolean) => void
  search: string
  onSearchChange: (value: string) => void
}

function DashboardHeader({
  taskCount,
  onNewTask,
  statusFilter,
  statuses,
  onStatusFilterChange,
  onStatusFilterAllChange,
  search,
  onSearchChange,
}: DashboardHeaderProps) {
  return (
    <div className="dashboardHeader">
      <h2>Current projects</h2>

      <span className="taskCount">{taskCount} tasks</span>

      <button
        className="primaryButton"
        // Передаём саму функцию React.
        // React вызовет её при клике по кнопке.
        onClick={onNewTask}
      >
        + New task
      </button>

      <section className="statusFilters">
        <label>
          All:
          <input
            type="checkbox"
            // Если выбраны все статусы — checkbox "All" отмечен.
            checked={statusFilter.length === statuses.length}
            onChange={(event) => {
              onStatusFilterAllChange(event.target.checked)
            }}
          />
        </label>

        {statuses.map((status) => (
          <label key={status}>
            {status}:
            <input
              type="checkbox"
              checked={statusFilter.includes(status)}
              onChange={(event) => {
                onStatusFilterChange(status, event.target.checked)
              }}
              value={status}
            />
          </label>
        ))}
      </section>

      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(event) => {
          onSearchChange(event.target.value)
        }}
      />
    </div>
  )
}

export default DashboardHeader
