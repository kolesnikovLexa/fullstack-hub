import { apiFetch } from "../utils/apiFetch"
import { getApiError } from "../utils/getApiError"

type User = {
  id: string
  email: string
}

// Авторизация пользователя.
export async function login(
  email: string,
  password: string,
): Promise<{ token: string; user: User }> {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()

    throw new Error(getApiError(errorData))
  }

  return response.json()
}

// Получить текущего пользователя по JWT.
export async function getCurrentUser(): Promise<User> {
  const response = await apiFetch("/auth/me")

  if (!response.ok) {
    const errorData = await response.json()

    throw new Error(getApiError(errorData))
  }

  return response.json()
}

// Зарегистрировать нового пользователя.
export async function register(email: string, password: string): Promise<void> {
  const response = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()

    throw new Error(getApiError(errorData))
  }
}
