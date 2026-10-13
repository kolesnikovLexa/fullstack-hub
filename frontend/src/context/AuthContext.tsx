import { createContext, useContext, useEffect, useState } from "react"

import { getCurrentUser, login as loginApi } from "../api/authApi"

type User = {
  id: string
  email: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  async function login(email: string, password: string) {
    const data = await loginApi(email, password)

    // JWT сохраняем отдельно от React state,
    // потому что он должен переживать перезагрузку страницы.
    localStorage.setItem("token", data.token)

    setUser(data.user)
  }

  function logout() {
    localStorage.removeItem("token")
    setUser(null)
  }

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token")

      if (!token) {
        setLoading(false)
        return
      }

      try {
        // Если JWT ещё действителен, восстанавливаем пользователя
        // после перезагрузки страницы.
        const user = await getCurrentUser()

        setUser(user)
      } catch {
        // Недействительный JWT больше не должен оставаться
        // в localStorage.
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
