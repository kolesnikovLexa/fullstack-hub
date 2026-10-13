import { createContext, useContext, useEffect, useState } from "react"
import type { Settings } from "../types/settings"
import { apiFetch } from "../utils/apiFetch"

type SettingsContextType = {
  settings: Settings
  updateSettings: (changes: Partial<Settings>) => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | null>(null)

function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    theme: "light",
    language: "ru",
    notifications: true,
  })

  useEffect(() => {
    async function loadSettings() {
      const token = localStorage.getItem("token")

      if (!token) {
        return
      }

      const response = await apiFetch("/settings")

      if (!response.ok) {
        throw new Error("Failed to load settings")
      }

      const data: Settings = await response.json()

      setSettings(data)
    }

    loadSettings()
  }, [])

  async function updateSettings(changes: Partial<Settings>) {
    const newSettings = {
      ...settings,
      ...changes,
    }

    const response = await apiFetch("/settings", {
      method: "PUT",
      body: JSON.stringify(newSettings),
    })

    if (!response.ok) {
      throw new Error("Failed to update settings")
    }

    const data: Settings = await response.json()

    setSettings(data)
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

function useSettings() {
  const context = useContext(SettingsContext)

  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider")
  }

  return context
}

export { SettingsProvider, useSettings }
