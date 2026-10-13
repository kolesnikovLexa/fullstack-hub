export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token")

  const response = await fetch(`http://localhost:3000/api${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 401) {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return response
}
