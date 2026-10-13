import { useSettings } from "../../context/SettingsContext"
import { languages, themes } from "../../data/settings"
import type { Language, Theme } from "../../types/settings"

function Settings() {
  const { settings, updateSettings } = useSettings()

  return (
    <main className="settings">
      <div className="settings__header">
        <h1>Settings</h1>
        <p>Manage your application preferences</p>
      </div>

      <div className="settings__card">
        <div className="settings__group">
          <label htmlFor="theme">Theme</label>

          <select
            id="theme"
            value={settings.theme}
            onChange={(event) => {
              updateSettings({
                theme: event.target.value as Theme,
              })
            }}
          >
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>

        <div className="settings__group">
          <label htmlFor="language">Language</label>

          <select
            id="language"
            value={settings.language}
            onChange={(event) => {
              updateSettings({
                language: event.target.value as Language,
              })
            }}
          >
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        <div className="settings__group settings__group--checkbox">
          <label htmlFor="notifications">Notifications</label>

          <input
            id="notifications"
            type="checkbox"
            checked={settings.notifications}
            onChange={(event) => {
              updateSettings({
                notifications: event.target.checked,
              })
            }}
          />
        </div>
      </div>
    </main>
  )
}

export default Settings
