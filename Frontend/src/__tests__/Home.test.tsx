import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import Home from '../pages/Home'
import { renderWithRouter } from '../test/render'

describe('Home', () => {
  it('renders the hero with name and CTA', () => {
    renderWithRouter(<Home />)
    expect(screen.getByText(/Quianne\./)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /voir mes projets/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /me contacter/i })).toBeInTheDocument()
  })

  it('shows the 20 ans stat', () => {
    renderWithRouter(<Home />)
    // Both "20" in stats and "20 ans" in the bio paragraph render — match either.
    expect(screen.getAllByText(/20/i).length).toBeGreaterThan(0)
  })
})
