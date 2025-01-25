import { render } from '@testing-library/react'
import NotFoundPage from 'pages/404'
import MockAppWrapper from '__mocks__/MockAppWrapper'

it('renders not found page unchanged', () => {
  const { container } = render(
    <MockAppWrapper>
      <NotFoundPage />
    </MockAppWrapper>
  )
  expect(container).toMatchSnapshot()
})
