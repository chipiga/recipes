import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import RecipeCard from '../RecipeCard'

// Mock FavoriteButton component
vi.mock('../FavoriteButton', () => ({
  default: ({ recipeId, short }) => (
    <button data-testid={`favorite-${recipeId}`} data-short={short}>
      ♥
    </button>
  ),
}))

// Mock Link component
vi.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

describe('RecipeCard', () => {
  const mockRecipe = {
    id: 'recipe-1',
    title: 'Test Recipe',
    category: 'Dessert',
    ingredients: ['sugar', 'flour', 'eggs'],
    image: 'test-image.jpg',
    uid: 'user123'
  }

  it('renders recipe information correctly', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    
    expect(screen.getByText('Test Recipe')).toBeInTheDocument()
    expect(screen.getByText('Dessert')).toBeInTheDocument()
    expect(screen.getByText('Zutaten: sugar, flour, eggs')).toBeInTheDocument()
    expect(screen.getByText('Details')).toBeInTheDocument()
    expect(screen.getByText('von user12')).toBeInTheDocument()
  })

  it('displays recipe image when provided', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    
    const image = screen.getByAltText('Test Recipe')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'test-image.jpg')
    expect(image).toHaveClass('h-40', 'w-full', 'object-cover')
  })

  it('renders without image when not provided', () => {
    const recipeWithoutImage = { ...mockRecipe, image: undefined }
    render(<RecipeCard recipe={recipeWithoutImage} />)
    
    expect(screen.queryByAltText('Test Recipe')).not.toBeInTheDocument()
  })

  it('renders FavoriteButton with correct props', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    
    const favoriteButton = screen.getByTestId('favorite-recipe-1')
    expect(favoriteButton).toBeInTheDocument()
    expect(favoriteButton).toHaveAttribute('data-short', 'true')
  })

  it('displays user ID when provided', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    
    expect(screen.getByText('von user12')).toBeInTheDocument()
  })

  it('does not display user ID when not provided', () => {
    const recipeWithoutUid = { ...mockRecipe, uid: undefined }
    render(<RecipeCard recipe={recipeWithoutUid} />)
    
    expect(screen.queryByText(/von/)).not.toBeInTheDocument()
  })

  it('has correct link to recipe details', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    
    const detailsLink = screen.getByText('Details')
    expect(detailsLink.closest('a')).toHaveAttribute('href', '/recipes/recipe-1')
  })

  it('applies correct CSS classes', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    
    const card = screen.getByText('Test Recipe').closest('div').parentElement.parentElement
    expect(card).toHaveClass('bg-white', 'rounded-2xl', 'shadow-sm', 'border', 'border-slate-200')
  })
})
