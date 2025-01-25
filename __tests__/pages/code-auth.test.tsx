import { render } from '@testing-library/react'
import CodeAuthPage from 'pages/code-auth'
import MockAppWrapper from '__mocks__/MockAppWrapper'

it('renders code auth page unchanged', () => {
  const { container } = render(
    <MockAppWrapper>
      <CodeAuthPage />
    </MockAppWrapper>
  )
  expect(container).toMatchSnapshot()
})
