import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

describe('Profile settings form', () => {
  it('renders the saved settings as initial values', () => {
    render(<App />)

    expect(screen.getByLabelText(/display name/i)).toHaveValue('Ada Lovelace')
    expect(screen.getByLabelText(/email address/i)).toHaveValue(
      'ada@example.com',
    )
    expect(screen.getByLabelText(/time zone/i)).toHaveValue('Europe/London')
    expect(screen.getByLabelText(/email notifications/i)).toBeChecked()
  })

  it('shows required errors and preserves entered values', async () => {
    const user = userEvent.setup()
    render(<App />)

    const displayName = screen.getByLabelText(/display name/i)
    const email = screen.getByLabelText(/email address/i)
    const timeZone = screen.getByLabelText(/time zone/i)

    await user.clear(displayName)
    await user.type(displayName, ' ')
    await user.clear(email)
    await user.selectOptions(timeZone, '')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(screen.getByText('Display name is required.')).toBeInTheDocument()
    expect(screen.getByText('Email address is required.')).toBeInTheDocument()
    expect(screen.getByText('Time zone is required.')).toBeInTheDocument()
    expect(displayName).toHaveValue(' ')
    expect(email).toHaveValue('')
    expect(timeZone).toHaveValue('')
    expect(displayName).toHaveAttribute('aria-invalid', 'true')
  })

  it('rejects an invalid email address', async () => {
    const user = userEvent.setup()
    render(<App />)

    const email = screen.getByLabelText(/email address/i)
    await user.clear(email)
    await user.type(email, 'ada-at-example')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument()
    expect(email).toHaveAttribute('aria-describedby', 'email-error')
  })

  it('submits normalized settings and announces success', async () => {
    const user = userEvent.setup()
    const saveSettings = vi.fn().mockResolvedValue(undefined)
    render(<App saveSettings={saveSettings} />)

    const displayName = screen.getByLabelText(/display name/i)
    await user.clear(displayName)
    await user.type(displayName, '  Grace Hopper  ')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => expect(saveSettings).toHaveBeenCalledTimes(1))
    expect(saveSettings).toHaveBeenCalledWith(
      expect.objectContaining({ displayName: 'Grace Hopper' }),
    )
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'Your settings were saved successfully.',
      ),
    )
  })

  it('disables the button while the save is pending', async () => {
    const user = userEvent.setup()
    let finishSave
    const saveSettings = vi.fn(
      () =>
        new Promise((resolve) => {
          finishSave = resolve
        }),
    )
    render(<App saveSettings={saveSettings} />)

    const button = screen.getByRole('button', { name: /save changes/i })
    await user.click(button)

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()

    finishSave()
    await waitFor(() => expect(button).toBeEnabled())
  })

  it('prevents duplicate submissions while a save is pending', () => {
    const saveSettings = vi.fn(() => new Promise(() => {}))
    render(<App saveSettings={saveSettings} />)

    const form = screen.getByRole('form', { name: /profile settings/i })
    fireEvent.submit(form)
    fireEvent.submit(form)

    expect(saveSettings).toHaveBeenCalledTimes(1)
  })
})
