import { render, waitFor, screen } from '@testing-library/react'
import Text from '@components/base/Text'

jest.mock('@libs/useTheme', () => ({
  useTheme() {
    return {
      theme: {
        color: '#ff00ff',
        textColor: undefined,
      },
    }
  },
}))

it('SHOULD render text inside component', () => {
  render(<Text>Test</Text>)
  waitFor(() => {
    const testEl = screen.findByText('Test')
    expect(testEl).toBeInTheDocument()
  })
})

it('SHOULD use theme styles when ignoreTheme flag is false or undefined', () => {
  render(<Text>Test</Text>)
  waitFor(() => {
    const testEl = screen.findByText('Test')
    expect(testEl).toBeInTheDocument()
    expect(testEl).toHaveStyle('color: #ff00ff')
  })
})

it('SHOULD not use theme styles when ignoreTheme flag is true', () => {
  render(<Text ignoreTheme>Test</Text>)
  waitFor(() => {
    const testEl = screen.findByText('Test')
    expect(testEl).toBeInTheDocument()
    expect(testEl).not.toHaveStyle('color: #ff00ff')
  })
})
