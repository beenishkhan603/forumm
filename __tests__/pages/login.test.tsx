import { render } from '@testing-library/react'
import LoginPage from 'pages/login'
import MockAppWrapper from '__mocks__/MockAppWrapper'

it('renders login unchanged', () => {
  const { container } = render(
    <MockAppWrapper>
      <LoginPage />
    </MockAppWrapper>
  )
  expect(container).toMatchSnapshot()
})
