import { getMongoDb } from "../db/mongo"
import { AppError } from "../errors/AppError"
import type { Settings, SettingsDocument } from "../types/settings"

export async function getSettings(userId: number): Promise<SettingsDocument> {
  const settingsCollection =
    getMongoDb().collection<SettingsDocument>("settings")

  const settings = await settingsCollection.findOne({ userId })

  if (settings) {
    return settings
  }

  // Создаём настройки по умолчанию при первом обращении пользователя.
  const defaultSettings: SettingsDocument = {
    userId,
    theme: "light",
    language: "ru",
    notifications: true,
  }

  await settingsCollection.insertOne(defaultSettings)

  return defaultSettings
}

export async function updateSettings(
  userId: number,
  settings: Settings,
): Promise<SettingsDocument> {
  const settingsCollection =
    getMongoDb().collection<SettingsDocument>("settings")

  const updatedSettings = await settingsCollection.findOneAndUpdate(
    { userId },
    {
      $set: {
        theme: settings.theme,
        language: settings.language,
        notifications: settings.notifications,
      },
    },
    { returnDocument: "after" },
  )

  if (!updatedSettings) {
    throw new AppError(404, "Settings not found")
  }

  return updatedSettings
}
