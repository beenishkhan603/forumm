import { SessionList } from '@components/event/SessionList'
import { EventSession } from '@graphql/__generated/graphql'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { buildEventMock } from '__mocks__/graphql/Event/getEventById'
import MockAppWrapper from '__mocks__/MockAppWrapper'

const sessMock = {
  description: 'Explore our virtual events platform in this demo session.',
  endDateTime: '2022-12-20T16:03',
  speakers: [
    {
      email: 'dan.marrable@448.studio',
      name: 'Dan Marrable',
      organization: '448 Studio',
      position: 'CEO',
      profileImage:
        'https://forumm-images-qa.s3.eu-west-1.amazonaws.com/user-content/cfccd2a4-a0be-4ca7-8c19-4959d384ba03/Dan Marrable Profile.jpg',
      ticketType: 'FREE',
    },
  ],
  stage: {
    class: 'INTERNAL',
    description: 'Join us to explore our all-in-one online event platform.',
    holdingVideoUrl: 'tuPHm37D0h0',
    title: 'Main Demo Event',
  },
  startDateTime: '2022-12-19T16:02',
  title: 'Demo Session',
  isBreak: false,
}

const pushSpy = jest.fn()

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
        push: pushSpy,
      }
    },
  }
})

it('SHOULD call push function WHEN an admin clicks on a session list item', async () => {
  pushSpy.mockClear()
  render(
    <MockAppWrapper
      mockProfile={{ groups: ['forumm-admin'] }}
      mocks={[buildEventMock()]}
    >
      <SessionList sessions={[sessMock as EventSession]} eventId={'123'} />
    </MockAppWrapper>
  )

  await waitFor(() => {
    const sessionListEl = screen.getByTestId('sessionList__item_0')
    expect(sessionListEl).toBeInTheDocument()
    fireEvent.click(sessionListEl)
  })
})

it('SHOULD render orange border WHEN session is a break', async () => {
  pushSpy.mockClear()
  render(
    <MockAppWrapper
      mockProfile={{ groups: ['forumm-admin'] }}
      mocks={[buildEventMock()]}
    >
      <SessionList
        sessions={[
          sessMock as EventSession,
          { ...sessMock, isBreak: true } as EventSession,
        ]}
        eventId={'123'}
      />
    </MockAppWrapper>
  )

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
