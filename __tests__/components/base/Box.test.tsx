import Box from '@components/base/Box'
import { render, waitFor, screen } from '@testing-library/react'

it('renders box unchanged', () => {
  const { container } = render(<Box>Test</Box>)
  expect(container).toMatchSnapshot()
})

it('SHOULD return null WHEN show is false', () => {
  render(<Box show={false}>Test</Box>)
  waitFor(async () => {
    const testEl = await screen.findByText('Test')
    expect(testEl).not.toBeInTheDocument()
  })
})

it('SHOULD renders box with style attributes', () => {
  render(<Box loading>Test</Box>)
  waitFor(async () => {
    const spinnerEl = await screen.findByTestId('box-spinner')
    expect(spinnerEl).toBeInTheDocument()
    const testEl = await screen.findByText('Test')
    expect(testEl).not.toBeInTheDocument()
  })
})

it('SHOULD renders box with style attributes', () => {
  render(<Box loading={false}>Test</Box>)
  waitFor(async () => {
    const spinnerEl = await screen.findByTestId('box-spinner')
    expect(spinnerEl).not.toBeInTheDocument()
    const testEl = await screen.findByText('Test')
    expect(testEl).toBeInTheDocument()
  })
})

it('SHOULD renders box with style attributes', () => {
  render(<Box style={{ display: 'none' }}>Test</Box>)
  waitFor(async () => {
    const testEl = await screen.findByText('Test')
    expect(testEl).not.toBeInTheDocument()
  })
})

it('SHOULD renders box with style attributes', () => {
  render(<Box ignoreTheme>Test</Box>)
  waitFor(async () => {
    const testEl = await screen.findByText('Test')
    expect(testEl).toBeInTheDocument()
  })
})

it('SHOULD renders box with style attributes', () => {
  render(<Box color={'foregroundColour'}>Test</Box>)
  waitFor(async () => {
    const testEl = await screen.findByText('Test')
    expect(testEl).toBeInTheDocument()
    expect(testEl).toHaveStyle('')
  })
})

it('SHOULD renders box with style attributes', () => {
  render(<Box textColour={'foregroundColour'}>Test</Box>)
  waitFor(async () => {
    const testEl = await screen.findByText('Test')
    expect(testEl).toBeInTheDocument()
    expect(testEl).toHaveStyle('')
  })
})

it('SHOULD renders box with style attributes', () => {
  jest.mock('@libs/useTheme', () => ({
    useTheme() {
      return {
        theme: {
          color: undefined,
          textColor: undefined,
        },
      }
    },
  }))
  render(<Box>Test</Box>)
  waitFor(async () => {
    const testEl = await screen.findByText('Test')
    expect(testEl).toBeInTheDocument()
    expect(testEl).toHaveStyle('')
  })
})
