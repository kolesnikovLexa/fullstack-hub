export type Settings = {
  theme: "light" | "dark"
  language: "ru" | "en"
  notifications: boolean
}

export type SettingsDocument = Settings & {
  userId: number
}
