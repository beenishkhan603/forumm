import { render } from '@testing-library/react'
import LoginPage from 'pages/login'
import VerifyAccount from 'pages/verify-account'
import MockAppWrapper from '__mocks__/MockAppWrapper'

it('renders verify account unchanged', () => {
  const { container } = render(
    <MockAppWrapper>
      <VerifyAccount />
    </MockAppWrapper>
  )
  expect(container).toMatchSnapshot()
})
