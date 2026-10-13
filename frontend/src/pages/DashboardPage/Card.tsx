import { statuses } from "../../data/data"
import type { Task, TaskStatus } from "../../types/task"

type CardProps = {
  task: Task
  deleteTask: (taskId: Task["id"]) => void
  updateTask: (taskId: Task["id"], changes: Partial<Task>) => void
  editTask: (task: Task) => void
}

function Card({ task, deleteTask, updateTask, editTask }: CardProps) {
  const onDeleteTask = () => {
    deleteTask(task.id)
  }

  const onUpdateTask = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Значение select приходит как string,
    // поэтому приводим его к нашему union type TaskStatus.
    updateTask(task.id, {
      status: event.target.value as TaskStatus,
    })
  }

  const onEditing = () => {
    editTask(task)
  }

  const onDragStart = (event: React.DragEvent<HTMLElement>) => {
    // Передаём UUID задачи в drag & drop.
    // Column получит его обратно при событии drop.
    event.dataTransfer.setData("text/plain", task.id)
  }

  return (
    <article className="card" draggable={true} onDragStart={onDragStart}>
      <div className="cardHeader">
        <h2>{task.title}</h2>

        <button className="deleteButton" onClick={onDeleteTask}>
          Delete
        </button>
      </div>

      <select name="status" value={task.status} onChange={onUpdateTask}>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <p>{task.description}</p>

      <button className="editButton" onClick={onEditing}>
        Edit
      </button>
    </article>
  )
}

export default Card
