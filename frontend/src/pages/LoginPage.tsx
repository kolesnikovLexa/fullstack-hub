import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    try {
      await login(email, password)

      navigate("/dashboard")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed")
    }
  }

  function fillDemoAccount() {
    setEmail("admin@example.com")
    setPassword("password123")
  }

  return (
    <main className="loginPage">
      <form className="loginForm" onSubmit={handleSubmit}>
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <p className="loginError">{error}</p>}

        {/* <p className="demoAccount">
          Demo account: admin@example.com / password123
        </p> */}

        <button type="button" onClick={fillDemoAccount}>
          Use demo account
        </button>

        <button type="submit">Login</button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  )
}

export default LoginPage
