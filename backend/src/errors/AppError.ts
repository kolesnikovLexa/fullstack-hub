export class AppError extends Error {
  statusCode: number
  details?: unknown

  constructor(statusCode: number, message: string, details?: unknown) {
    // Передаём сообщение в стандартный класс Error.
    super(message)

    // HTTP-статус, который должен получить клиент.
    this.statusCode = statusCode

    // Дополнительная информация, например ошибки Zod.
    this.details = details
  }
}
