import { render } from '@testing-library/react'
import ChangePasswordPage from 'pages/user/change-password'
import MockAppWrapper from '__mocks__/MockAppWrapper'

it('renders change password page unchanged', () => {
  const { container } = render(
    <MockAppWrapper>
      <ChangePasswordPage />
    </MockAppWrapper>
  )
  expect(container).toMatchSnapshot()
})
