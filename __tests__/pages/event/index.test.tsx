import { render, screen } from '@testing-library/react'
import EventPage from 'pages/event/[eventId]'
import MockAppWrapper from '__mocks__/MockAppWrapper'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: { eventId: '123' },
      pathname: '/event',
      push: () => {},
    }
  },
}))

it('renders event index page unchanged', async () => {
  const { container } = render(
    <MockAppWrapper>
      <EventPage />
    </MockAppWrapper>
  )
  expect(await screen.findByText('448 Studio')).toBeInTheDocument()

  expect(container).toMatchSnapshot()
})
