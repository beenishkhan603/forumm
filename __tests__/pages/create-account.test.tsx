import { render } from '@testing-library/react'
import CreateAccountPage from 'pages/create-account'
import MockAppWrapper from '__mocks__/MockAppWrapper'

it('renders create account page unchanged', () => {
  const { container } = render(
    <MockAppWrapper>
      <CreateAccountPage />
    </MockAppWrapper>
  )
  expect(container).toMatchSnapshot()
})
