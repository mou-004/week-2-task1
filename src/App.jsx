import { useState } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notifications: true,
  })

  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setSaved(false)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.'
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Enter a valid email address.'
    }

    return newErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setSaved(false)
      return
    }

    setErrors({})
    setSaved(true)
  }

  return (
    <main className="settings-page">
      <form className="settings-form" onSubmit={handleSubmit}>
        <h1>Settings</h1>
        <p className="subtitle">Update your profile preferences.</p>

        <div className="form-group">
          <label htmlFor="name">Display name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <label className="checkbox-row">
          <input
            name="notifications"
            type="checkbox"
            checked={formData.notifications}
            onChange={handleChange}
          />
          Receive email notifications
        </label>

        <button type="submit">Save settings</button>

        {saved && <p className="success">Settings saved successfully.</p>}
      </form>
    </main>
  )
}

export default App