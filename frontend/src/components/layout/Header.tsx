import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="header">
      <h1>My Dashboard</h1>

      {user ? (
        <button className="profileButton" onClick={logout}>
          Logout ({user.email})
        </button>
      ) : (
        <Link className="profileButton" to="/login">
          Profile
        </Link>
      )}
    </header>
  )
}

export default Header
