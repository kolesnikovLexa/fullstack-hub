import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

import { register } from "../api/authApi"

const registerSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const validation = registerSchema.safeParse({
      email,
      password,
    })

    if (!validation.success) {
      setError(validation.error.issues[0].message)
      return
    }

    try {
      // HTTP-запрос находится в authApi.
      // RegisterPage отвечает только за форму и UI.
      await register(email, password)

      navigate("/login")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed")
    }
  }

  return (
    <main className="loginPage">
      <form className="loginForm" onSubmit={handleSubmit}>
        <h1>Register</h1>

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

        <button type="submit">Register</button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  )
}

export default RegisterPage
