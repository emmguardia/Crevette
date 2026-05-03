import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import About from '../pages/About'
import { renderWithRouter } from '../test/render'

describe('About', () => {
  it('renders the bio and timeline', () => {
    renderWithRouter(<About />)
    expect(screen.getByText(/Qui suis-je/i)).toBeInTheDocument()
    // "Guardia" appears in the bio paragraph, the meta line and the timeline.
    expect(screen.getAllByText(/Guardia/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Parcours/i)).toBeInTheDocument()
  })
})
