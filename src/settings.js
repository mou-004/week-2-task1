export const DEFAULT_SETTINGS = {
  displayName: 'Ada Lovelace',
  email: 'ada@example.com',
  timeZone: 'Europe/London',
  emailNotifications: true,
}

export const TIME_ZONES = [
  { value: '', label: 'Select a time zone' },
  { value: 'Asia/Dhaka', label: 'Dhaka (GMT+6)' },
  { value: 'Europe/London', label: 'London' },
  { value: 'America/New_York', label: 'New York' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateSettings(values) {
  const errors = {}
  const displayName = values.displayName.trim()
  const email = values.email.trim()

  if (!displayName) {
    errors.displayName = 'Display name is required.'
  } else if (displayName.length < 2 || displayName.length > 50) {
    errors.displayName = 'Display name must be between 2 and 50 characters.'
  }

  if (!email) {
    errors.email = 'Email address is required.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.timeZone) {
    errors.timeZone = 'Time zone is required.'
  }

  return errors
}

export function normalizeSettings(values) {
  return {
    ...values,
    displayName: values.displayName.trim(),
    email: values.email.trim(),
  }
}
