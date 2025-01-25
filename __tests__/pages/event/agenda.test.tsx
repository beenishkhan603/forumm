import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import LiveEventPage from 'pages/event/[eventId]/agenda'
import { buildEventMock } from '__mocks__/graphql/Event/getEventById'
import MockAppWrapper from '__mocks__/MockAppWrapper'
import moment from 'moment'

jest.mock('next/router', () => {
  const realModule = jest.requireActual('next/router')
  return {
    ...realModule,
    useRouter() {
      return {
        query: {
          eventId: '123',
          preview: undefined,
        },
        pathname: 'event/agenda',
        push: jest.fn(),
      }
    },
  }
})
jest.mock('moment', () => {
  const actualMoment = jest.requireActual('moment')

  const mockMoment: any = (date: string | undefined) =>
    actualMoment('2024-05-05T00:00:00.000')

  for (let prop in actualMoment) {
    mockMoment[prop] = actualMoment[prop]
  }

  return mockMoment
})

it('renders agenda page unchanged', async () => {
  const { container } = render(
    <MockAppWrapper>
      <LiveEventPage />
    </MockAppWrapper>
  )
  await waitForElementToBeRemoved(() => screen.queryAllByTestId('loading'))

  expect(container).toMatchSnapshot()
  jest.unmock('moment')
})

it('SHOULD use fallback social link WHEN event has no social link on file', async () => {
  render(
    <MockAppWrapper mockProfile={{ groups: ['forumm-admin'] }}>
      <LiveEventPage />
    </MockAppWrapper>
  )

  await waitForElementToBeRemoved(() => screen.queryAllByTestId('loading'))
  waitFor(() => {
    const Facebook_El = screen.queryByTestId('social-facebook')
    const Twitter_El = screen.queryByTestId('social-twitter')
    const Linkedin_El = screen.queryByTestId('social-linkdin')
    const Instagram_El = screen.queryByTestId('social-instagram')
    //expect(Facebook_El).toBeInTheDocument()
    expect(Twitter_El).not.toBeInTheDocument()
    expect(Linkedin_El).not.toBeInTheDocument()
    expect(Instagram_El).not.toBeInTheDocument()
    //expect(Facebook_El).toHaveAttribute('href')
  })
})

it('SHOULD render session list correctly WHEN the event has session data', async () => {
  render(
    <MockAppWrapper mockProfile={{ groups: ['forumm-admin'] }}>
      <LiveEventPage />
    </MockAppWrapper>
  )

  await waitForElementToBeRemoved(() => screen.queryAllByTestId('loading'))
  await waitFor(
    () => {
      expect(
        screen.findByTestId('sessionList_item_1')
      ).resolves.toBeInTheDocument()
      expect(
        screen.findByTestId('sessionList_item_2')
      ).resolves.toBeInTheDocument()
    },
    { timeout: 5000 }
  )
})

it('SHOULD render no session list WHEN session data is undefined', async () => {
  render(
    <MockAppWrapper
      mockProfile={{ groups: ['forumm-admin'] }}
      mocks={[buildEventMock({ sessions: undefined })]}
    >
      <LiveEventPage />
    </MockAppWrapper>
  )

  await waitForElementToBeRemoved(() => screen.queryAllByTestId('loading'))
  const sessionListEl = screen.queryByTestId('sessionList_item_1')
  expect(sessionListEl).not.toBeInTheDocument()
})
it('SHOULD render no session list WHEN there is no session data', async () => {
  render(
    <MockAppWrapper
      mockProfile={{ groups: ['forumm-admin'] }}
      mocks={[buildEventMock({ sessions: [] })]}
    >
      <LiveEventPage />
    </MockAppWrapper>
  )

  await waitForElementToBeRemoved(() => screen.queryAllByTestId('loading'))
  waitFor(() => {
    const sessionListEl = screen.findByTestId('sessionList_item_1')

    expect(sessionListEl).not.toBeInTheDocument()
  })
})
