import Card from "./Card"
import type { Task, TaskStatus } from "../../types/task"

type ColumnProps = {
  status: TaskStatus
  taskList: Task[]
  deleteTask: (taskId: Task["id"]) => void
  updateTask: (taskId: Task["id"], changes: Partial<Task>) => void
  editTask: (task: Task) => void
}

function Column({
  status,
  taskList,
  deleteTask,
  updateTask,
  editTask,
}: ColumnProps) {
  const filteredTasks = taskList.filter((task) => task.status === status)

  const onDrop = (event: React.DragEvent<HTMLElement>) => {
    const taskId = event.dataTransfer.getData("text/plain")

    updateTask(taskId, { status })
  }

  return (
    <section
      className="column"
      onDragOver={(event) => {
        event.preventDefault()
      }}
      onDrop={onDrop}
    >
      {filteredTasks.map((card) => (
        <Card
          key={card.id}
          task={card}
          deleteTask={deleteTask}
          updateTask={updateTask}
          editTask={editTask}
        />
      ))}
    </section>
  )
}

export default Column
