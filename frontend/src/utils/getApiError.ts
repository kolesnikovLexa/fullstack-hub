export function getApiError(errorData: {
  message?: string
  details?: {
    path: string[]
    message: string
  }[]
}) {
  // Если сервер вернул ошибки валидации — объединяем их в одну строку.
  if (errorData.details?.length) {
    return errorData.details
      .map((error) => `${error.path.join(".")}: ${error.message}`)
      .join(", ")
  }

  return errorData.message || "Something went wrong"
}
