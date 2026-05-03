import { describe, it, expect } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import Game from '../pages/Game'
import { renderWithRouter } from '../test/render'

describe('Game (Pendu)', () => {
  it('renders the page heading and a reset button', () => {
    renderWithRouter(<Game />)
    expect(screen.getByRole('heading', { name: 'Pendu' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Nouvelle partie/i })).toBeInTheDocument()
  })

  it('disables a letter button after it is clicked', () => {
    renderWithRouter(<Game />)
    const a = screen.getByRole('button', { name: 'a' })
    expect(a).not.toBeDisabled()
    fireEvent.click(a)
    // After re-render the button reference may have changed — re-query.
    expect(screen.getByRole('button', { name: 'a' })).toBeDisabled()
  })

  it('responds to physical keyboard input', () => {
    renderWithRouter(<Game />)
    expect(screen.getByRole('button', { name: 'e' })).not.toBeDisabled()
    fireEvent.keyDown(window, { key: 'e' })
    expect(screen.getByRole('button', { name: 'e' })).toBeDisabled()
  })

  it('ignores keystrokes with modifier keys (browser shortcuts)', () => {
    renderWithRouter(<Game />)
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true })
    expect(screen.getByRole('button', { name: 'z' })).not.toBeDisabled()
  })
})
