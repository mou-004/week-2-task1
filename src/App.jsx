import { useRef, useState } from 'react'
import './App.css'
import {
  DEFAULT_SETTINGS,
  TIME_ZONES,
  normalizeSettings,
  validateSettings,
} from './settings.js'

const wait = (milliseconds) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds))

async function defaultSaveSettings() {
  await wait(700)
}

function FieldError({ id, message }) {
  if (!message) return null

  return (
    <p className="field-error" id={id}>
      {message}
    </p>
  )
}

function App({ saveSettings = defaultSaveSettings }) {
  const [formData, setFormData] = useState(DEFAULT_SETTINGS)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittingRef = useRef(false)

  const updateField = (event) => {
    const { name, value, type, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : value

    setFormData((current) => ({ ...current, [name]: nextValue }))
    setErrors((current) => {
      if (!current[name]) return current
      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })
    setStatus({ type: 'idle', message: '' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (submittingRef.current) return

    const validationErrors = validateSettings(formData)
    setErrors(validationErrors)
    setStatus({ type: 'idle', message: '' })

    if (Object.keys(validationErrors).length > 0) return

    submittingRef.current = true
    setIsSubmitting(true)

    try {
      const normalizedData = normalizeSettings(formData)
      await saveSettings(normalizedData)
      setFormData(normalizedData)
      setStatus({
        type: 'success',
        message: 'Your settings were saved successfully.',
      })
    } catch {
      setStatus({
        type: 'error',
        message: 'We could not save your settings. Please try again.',
      })
    } finally {
      submittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <main className="settings-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <section className="settings-card" aria-labelledby="settings-title">
        <aside className="settings-intro">
          <span className="eyebrow">Profile control</span>
          <h1 id="settings-title">Make your space feel like yours.</h1>
          <p>
            Keep your account details current and choose how you want to hear
            from us.
          </p>

          <div className="privacy-note">
            <span aria-hidden="true">✦</span>
            <p>Your profile changes stay private to your account.</p>
          </div>
        </aside>

        <form
          className="settings-form"
          aria-labelledby="form-title"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="form-heading">
            <div>
              <p className="section-label">Account</p>
              <h2 id="form-title">Profile settings</h2>
            </div>
            <span className="status-dot" aria-hidden="true" />
          </div>

          <div className="field-grid">
            <div className="field-group field-group-wide">
              <label htmlFor="displayName">Display name</label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                value={formData.displayName}
                onChange={updateField}
                aria-invalid={Boolean(errors.displayName)}
                aria-describedby={
                  errors.displayName ? 'displayName-error' : undefined
                }
              />
              <FieldError
                id="displayName-error"
                message={errors.displayName}
              />
            </div>

            <div className="field-group field-group-wide">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={updateField}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              <FieldError id="email-error" message={errors.email} />
            </div>

            <div className="field-group field-group-wide">
              <label htmlFor="timeZone">Time zone</label>
              <select
                id="timeZone"
                name="timeZone"
                value={formData.timeZone}
                onChange={updateField}
                aria-invalid={Boolean(errors.timeZone)}
                aria-describedby={
                  errors.timeZone ? 'timeZone-error' : 'timeZone-help'
                }
              >
                {TIME_ZONES.map((timeZone) => (
                  <option key={timeZone.value || 'empty'} value={timeZone.value}>
                    {timeZone.label}
                  </option>
                ))}
              </select>
              {!errors.timeZone && (
                <p className="field-help" id="timeZone-help">
                  Used for timestamps and scheduled updates.
                </p>
              )}
              <FieldError id="timeZone-error" message={errors.timeZone} />
            </div>
          </div>

          <label className="toggle-row" htmlFor="emailNotifications">
            <span>
              <strong>Email notifications</strong>
              <small>Receive occasional account and product updates.</small>
            </span>
            <span className="switch">
              <input
                id="emailNotifications"
                name="emailNotifications"
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={updateField}
              />
              <span className="switch-track" aria-hidden="true" />
            </span>
          </label>

          <div className="form-footer">
            <div
              className={`form-status form-status-${status.type}`}
              role={status.type === 'error' ? 'alert' : 'status'}
              aria-live="polite"
            >
              {status.message}
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default App
