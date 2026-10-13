import type { Request, Response, NextFunction } from "express"

import { AppError } from "../errors/AppError"

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(error)

  // Наши ожидаемые ошибки уже содержат HTTP-статус и дополнительные данные.
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    })
  }

  // Неизвестные ошибки не раскрываем клиенту.
  // Для них возвращаем общий статус 500.
  return res.status(500).json({
    message: "Internal server error",
  })
}
