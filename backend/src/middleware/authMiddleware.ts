import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { AppError } from "../errors/AppError"
import type { AuthPayload } from "../types/auth"

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Получаем JWT из заголовка:
  // Authorization: Bearer <token>
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new AppError(401, "Authorization header is required")
  }

  // Отделяем сам токен от "Bearer".
  const token = authHeader.split(" ")[1]

  if (!token) {
    throw new AppError(401, "Token is required")
  }

  try {
    // Проверяем подпись и срок действия JWT.
    // Если всё хорошо — получаем данные пользователя из payload.
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload

    // Сохраняем payload в request,
    // чтобы следующие обработчики могли узнать текущего пользователя.
    req.user = payload

    // Передаём управление следующему middleware или route handler.
    next()
  } catch {
    // Сюда попадает недействительный или просроченный JWT.
    throw new AppError(401, "Invalid or expired token")
  }
}
