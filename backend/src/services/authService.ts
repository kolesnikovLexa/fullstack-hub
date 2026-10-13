import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import { AppError } from "../errors/AppError"
import { db, prisma } from "../prisma/db"
import { registerSchema, loginSchema } from "../validation/auth"

// Регистрация нового пользователя.
export async function registerUser(email: string, password: string) {
  const validation = registerSchema.safeParse({
    email,
    password,
  })

  if (!validation.success) {
    throw new AppError(
      400,
      "Invalid registration data",
      validation.error.issues,
    )
  }

  const existingUser = await prisma.query(
    db.sql.public.users
      .select("id")
      .where((f, fns) => fns.eq(f.email, email))
      .build(),
  )

  if (existingUser.length > 0) {
    throw new AppError(409, "User already exists")
  }

  // В БД никогда не сохраняем пароль в открытом виде.
  const hashedPassword = await bcrypt.hash(password, 10)

  const result = await prisma.query(
    db.sql.public.users
      .insert([
        {
          email,
          password: hashedPassword,
        },
      ])
      .returning("id", "email")
      .build(),
  )

  const user = result[0]

  return {
    id: user.id,
    email: user.email,
  }
}

// Проверяем логин/пароль и выдаём JWT.
export async function loginUser(email: string, password: string) {
  const validation = loginSchema.safeParse({
    email,
    password,
  })

  if (!validation.success) {
    throw new AppError(400, "Invalid login data", validation.error.issues)
  }

  const result = await prisma.query(
    db.sql.public.users
      .select("id", "email", "password")
      .where((f, fns) => fns.eq(f.email, email))
      .build(),
  )

  if (result.length === 0) {
    throw new AppError(401, "Invalid email or password")
  }

  const user = result[0]

  // Сравниваем обычный пароль с хэшем из БД.
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password")
  }

  // В JWT кладём данные, необходимые для идентификации пользователя.
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    },
  )

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  }
}

// Получаем данные текущего пользователя по userId из JWT.
export async function getCurrentUser(userId: number) {
  const result = await prisma.query(
    db.sql.public.users
      .select("id", "email")
      .where((f, fns) => fns.eq(f.id, Number(userId)))
      .build(),
  )

  if (result.length === 0) {
    throw new AppError(404, "User not found")
  }

  const user = result[0]

  return {
    id: user.id,
    email: user.email,
  }
}
