import { render } from '@testing-library/react'
import ForgotPassword from 'pages/forgot-password'
import MockAppWrapper from '__mocks__/MockAppWrapper'

it('renders forgot password page unchanged', () => {
  const { container } = render(
    <MockAppWrapper>
      <ForgotPassword />
    </MockAppWrapper>
  )
  expect(container).toMatchSnapshot()
})
