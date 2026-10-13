import { languages, themes } from "../data/settings"

export type Theme = (typeof themes)[number]
export type Language = (typeof languages)[number]

export type Settings = {
  theme: Theme
  language: Language
  notifications: boolean
}
