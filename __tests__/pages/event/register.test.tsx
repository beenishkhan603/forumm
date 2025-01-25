import { render, screen } from '@testing-library/react'
import EventRegister from 'pages/event/[eventId]/register'
import MockAppWrapper from '__mocks__/MockAppWrapper'
import moment from 'moment'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: { eventId: '123' },
      pathname: '/event/register',
    }
  },
}))

jest.mock('moment', () => {
  const actualMoment = jest.requireActual('moment')

  const mockMoment: any = (date: string | undefined) =>
    actualMoment('2024-05-05T00:00:00.000')

  for (let prop in actualMoment) {
    mockMoment[prop] = actualMoment[prop]
  }

  return mockMoment
})

it('renders event register page unchanged', async () => {
  const { container } = render(
    <MockAppWrapper>
      <EventRegister />
    </MockAppWrapper>
  )
  expect(
    await screen.findAllByText('Forumm Demo Event').then((data) => data[0])
  ).toBeInTheDocument()

  expect(container).toMatchSnapshot()
  jest.unmock('moment')
})
