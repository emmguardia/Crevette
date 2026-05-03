import { describe, it, expect } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import Contact from '../pages/Contact'
import { renderWithRouter } from '../test/render'

describe('Contact', () => {
  it('renders the form with required fields', () => {
    renderWithRouter(<Contact />)
    expect(screen.getByPlaceholderText(/Nom/i)).toBeRequired()
    expect(screen.getByPlaceholderText(/Email/i)).toBeRequired()
    expect(screen.getByPlaceholderText(/Message/i)).toBeRequired()
  })

  it('has a hidden honeypot field', () => {
    renderWithRouter(<Contact />)
    const form = document.querySelector('form')!
    const honeypot = form.elements.namedItem('website') as HTMLInputElement
    expect(honeypot).toBeTruthy()
    expect(honeypot.getAttribute('aria-hidden')).toBe('true')
    expect(honeypot.tabIndex).toBe(-1)
  })

  it('silently swallows submissions when honeypot is filled (bot)', async () => {
    renderWithRouter(<Contact />)
    const form = document.querySelector('form')!
    const honeypot = form.elements.namedItem('website') as HTMLInputElement
    honeypot.value = 'http://spam.example'
    fireEvent.change(form.elements.namedItem('nom') as HTMLInputElement, {
      target: { value: 'Bot' },
    })
    fireEvent.change(form.elements.namedItem('email') as HTMLInputElement, {
      target: { value: 'bot@bot.bot' },
    })
    fireEvent.change(form.elements.namedItem('message') as HTMLTextAreaElement, {
      target: { value: 'spam' },
    })
    fireEvent.submit(form)
    await waitFor(() => {
      expect(screen.getByText(/Envoyé/i)).toBeInTheDocument()
    })
  })
})
