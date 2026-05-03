import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import Projects from '../pages/Projects'
import { renderWithRouter } from '../test/render'

describe('Projects', () => {
  it('renders all three project cards', () => {
    renderWithRouter(<Projects />)
    expect(screen.getByText(/Site Web/i)).toBeInTheDocument()
    expect(screen.getByText(/Projet Réseau/i)).toBeInTheDocument()
    expect(screen.getByText(/Cyber & sécurité/i)).toBeInTheDocument()
  })

  it('uses rel="noopener noreferrer" on external links', () => {
    renderWithRouter(<Projects />)
    const externalLinks = screen
      .getAllByRole('link')
      .filter(a => a.getAttribute('target') === '_blank')
    expect(externalLinks.length).toBeGreaterThan(0)
    for (const a of externalLinks) {
      expect(a.getAttribute('rel')).toContain('noopener')
      expect(a.getAttribute('rel')).toContain('noreferrer')
    }
  })
})
