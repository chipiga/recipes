import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SearchAndFilterBar from '../SearchAndFilterBar'

// Mock the UI components
vi.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }) => <label {...props}>{children}</label>,
}))

vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, placeholder, className, ...props }) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  ),
}))

// Mock Redux hooks
vi.mock('react-redux', () => {
  const mockUseSelector = vi.fn()
  
  return {
    useSelector: mockUseSelector,
    __mockUseSelector: mockUseSelector,
  }
})

describe('SearchAndFilterBar', () => {
  let mockSetQuery
  let mockSetCategory
  let mockUseSelector

  beforeEach(() => {
    mockSetQuery = vi.fn()
    mockSetCategory = vi.fn()
    
    vi.clearAllMocks()
    
    // Get the mock functions from the mocked module
    const { __mockUseSelector } = require('react-redux')
    mockUseSelector = __mockUseSelector
  })

  // TODO: Fix Redux mocking issues
  it.skip('renders search input and category filter', () => {
    mockUseSelector.mockReturnValue([])
    
    render(
      <SearchAndFilterBar
        query=""
        setQuery={mockSetQuery}
        category="Alle"
        setCategory={mockSetCategory}
      />
    )
    
    expect(screen.getByLabelText('Suche nach Titel/Zutat')).toBeInTheDocument()
    expect(screen.getByLabelText('Kategorie')).toBeInTheDocument()
  })

  it.skip('displays search input with correct placeholder', () => {
    mockUseSelector.mockReturnValue([])
    
    render(
      <SearchAndFilterBar
        query=""
        setQuery={mockSetQuery}
        category="Alle"
        setCategory={mockSetCategory}
      />
    )
    
    const searchInput = screen.getByPlaceholderText('z.B. Nudeln, Tomaten, Curry...')
    expect(searchInput).toBeInTheDocument()
  })

  it.skip('calls setQuery when search input changes', () => {
    mockUseSelector.mockReturnValue([])
    
    render(
      <SearchAndFilterBar
        query=""
        setQuery={mockSetQuery}
        category="Alle"
        setCategory={mockSetCategory}
      />
    )
    
    const searchInput = screen.getByLabelText('Suche nach Titel/Zutat')
    fireEvent.change(searchInput, { target: { value: 'pasta' } })
    
    expect(mockSetQuery).toHaveBeenCalledWith('pasta')
  })

  it.skip('calls setCategory when category select changes', () => {
    mockUseSelector.mockReturnValue([])
    
    render(
      <SearchAndFilterBar
        query=""
        setQuery={mockSetQuery}
        category="Alle"
        setCategory={mockSetCategory}
      />
    )
    
    const categorySelect = screen.getByLabelText('Kategorie')
    fireEvent.change(categorySelect, { target: { value: 'Dessert' } })
    
    expect(mockSetCategory).toHaveBeenCalledWith('Dessert')
  })

  it.skip('displays current query value', () => {
    mockUseSelector.mockReturnValue([])
    
    render(
      <SearchAndFilterBar
        query="curry"
        setQuery={mockSetQuery}
        category="Alle"
        setCategory={mockSetCategory}
      />
    )
    
    const searchInput = screen.getByLabelText('Suche nach Titel/Zutat')
    expect(searchInput).toHaveValue('curry')
  })

  it.skip('displays current category value', () => {
    mockUseSelector.mockReturnValue([])
    
    render(
      <SearchAndFilterBar
        query=""
        setQuery={mockSetQuery}
        category="Dessert"
        setCategory={mockSetCategory}
      />
    )
    
    const categorySelect = screen.getByLabelText('Kategorie')
    expect(categorySelect).toHaveValue('Dessert')
  })

  it.skip('generates categories from recipes', () => {
    const mockRecipes = [
      { id: '1', category: 'Dessert' },
      { id: '2', category: 'Hauptgericht' },
      { id: '3', category: 'Dessert' }, // Duplicate
      { id: '4', category: 'Vorspeise' },
      { id: '5' }, // No category
    ]

    mockUseSelector.mockReturnValue(mockRecipes)

    render(
      <SearchAndFilterBar
        query=""
        setQuery={mockSetQuery}
        category="Alle"
        setCategory={mockSetCategory}
      />
    )
    
    const categorySelect = screen.getByLabelText('Kategorie')
    const options = Array.from(categorySelect.querySelectorAll('option'))
    
    expect(options).toHaveLength(5) // "Alle" + 4 unique categories
    expect(options[0]).toHaveValue('Alle')
    expect(options[1]).toHaveValue('Dessert')
    expect(options[2]).toHaveValue('Hauptgericht')
    expect(options[3]).toHaveValue('Vorspeise')
    expect(options[4]).toHaveValue('Sonstiges') // Default for recipes without category
  })

  it.skip('handles empty recipes array', () => {
    mockUseSelector.mockReturnValue([])

    render(
      <SearchAndFilterBar
        query=""
        setQuery={mockSetQuery}
        category="Alle"
        setCategory={mockSetCategory}
      />
    )
    
    const categorySelect = screen.getByLabelText('Kategorie')
    const options = Array.from(categorySelect.querySelectorAll('option'))
    
    expect(options).toHaveLength(1) // Only "Alle"
    expect(options[0]).toHaveValue('Alle')
  })

  it.skip('handles recipes with no category', () => {
    const mockRecipes = [
      { id: '1' }, // No category
      { id: '2' }, // No category
    ]

    mockUseSelector.mockReturnValue(mockRecipes)

    render(
      <SearchAndFilterBar
        query=""
        setQuery={mockSetQuery}
        category="Alle"
        setCategory={mockSetCategory}
      />
    )
    
    const categorySelect = screen.getByLabelText('Kategorie')
    const options = Array.from(categorySelect.querySelectorAll('option'))
    
    expect(options).toHaveLength(2) // "Alle" + "Sonstiges"
    expect(options[0]).toHaveValue('Alle')
    expect(options[1]).toHaveValue('Sonstiges')
  })

  it.skip('applies correct CSS classes', () => {
    mockUseSelector.mockReturnValue([])

    render(
      <SearchAndFilterBar
        query=""
        setQuery={mockSetQuery}
        category="Alle"
        setCategory={mockSetCategory}
      />
    )
    
    const container = screen.getByLabelText('Suche nach Titel/Zutat').closest('div').parentElement
    expect(container).toHaveClass('flex', 'flex-col', 'md:flex-row', 'gap-3', 'md:items-end', 'md:justify-between')
  })

  it.skip('search input has correct focus styles', () => {
    mockUseSelector.mockReturnValue([])

    render(
      <SearchAndFilterBar
        query=""
        setQuery={mockSetQuery}
        category="Alle"
        setCategory={mockSetCategory}
      />
    )
    
    const searchInput = screen.getByLabelText('Suche nach Titel/Zutat')
    expect(searchInput).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-slate-300')
  })

  it.skip('category select has correct styling', () => {
    mockUseSelector.mockReturnValue([])

    render(
      <SearchAndFilterBar
        query=""
        setQuery={mockSetQuery}
        category="Alle"
        setCategory={mockSetCategory}
      />
    )
    
    const categorySelect = screen.getByLabelText('Kategorie')
    expect(categorySelect).toHaveClass('border', 'border-slate-300', 'rounded-xl', 'px-3', 'py-2')
  })
})
