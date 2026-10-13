import { NavLink } from "react-router-dom"

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Menu</h2>

      <nav className="sidebarNavigation">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Dashboard
        </NavLink>
        <NavLink to="/employees">Employees</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
