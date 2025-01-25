import LoadingSpinner from '@components/base/LoadingSpinner'
import { render, waitFor, screen } from '@testing-library/react'

it('renders profile image unchanged', () => {
  const { container } = render(<LoadingSpinner />)
  expect(container).toMatchSnapshot()
})

it('renders profile image unchanged', () => {
  render(<LoadingSpinner />)
  waitFor(async () => {
    const spinnerEl = await screen.findByTestId('loading')
    expect(spinnerEl).toBeInTheDocument()
    expect(spinnerEl).toHaveClass('w-4 h-4')
  })
})

it('renders profile image unchanged', () => {
  render(<LoadingSpinner size={'small'} />)
  waitFor(async () => {
    const spinnerEl = await screen.findByTestId('loading')
    expect(spinnerEl).toBeInTheDocument()
    expect(spinnerEl).toHaveClass('w-4 h-4')
  })
})

it('renders profile image unchanged', () => {
  render(<LoadingSpinner size={'medium'} />)
  waitFor(async () => {
    const spinnerEl = await screen.findByTestId('loading')
    expect(spinnerEl).toBeInTheDocument()
    expect(spinnerEl).toHaveClass('w-12 h-12')
  })
})

it('renders profile image unchanged', () => {
  render(<LoadingSpinner size={'large'} />)
  waitFor(async () => {
    const spinnerEl = await screen.findByTestId('loading')
    expect(spinnerEl).toBeInTheDocument()
    expect(spinnerEl).toHaveClass('w-32 h-32')
  })
})
