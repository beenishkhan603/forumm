import { render } from '@testing-library/react'
import UserDetailsPage from 'pages/settings'
import MockAppWrapper from '__mocks__/MockAppWrapper'

it('renders user index page unchanged', () => {
  const { container } = render(
    <MockAppWrapper>
      <UserDetailsPage />
    </MockAppWrapper>
  )
  expect(container).toMatchSnapshot()
})
