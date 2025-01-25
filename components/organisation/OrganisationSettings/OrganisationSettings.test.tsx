import { useJestRouter } from '@libs/Utility/Test/util'
import { render, waitFor, screen } from '@testing-library/react'
import MockAppWrapper, { defaultMockProfile } from '__mocks__/MockAppWrapper'
import OrganisationSettings from './OrganisationSettings'

const pushSpy = jest.fn()

jest.mock('next/router', () => {
  const realModule = jest.requireActual('next/router')
  return {
    ...realModule,
    useRouter() {
      return {
        query: '',
        pathname: '',
        push: pushSpy,
      }
    },
  }
})
describe('Organisation Settings', () => {
  beforeEach(() => {
    pushSpy.mockClear()
  })

  test('Snapshot', () => {
    const { container } = render(
      <MockAppWrapper>
        <OrganisationSettings name={defaultMockProfile.company!} />
      </MockAppWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  describe('User Auth', () => {
    test("SHOULD push user to dashboard WHEN they're not authorised", () => {
      render(
        <MockAppWrapper>
          <OrganisationSettings name={defaultMockProfile.company!} />
        </MockAppWrapper>
      )
      expect(pushSpy).toBeCalledWith('/')
    })

    test("SHOULD NOT push user to dashboard WHEN they're authorised (Organiser)", () => {
      render(
        <MockAppWrapper mockProfile={{ groups: ['organizer'] }}>
          <OrganisationSettings name={defaultMockProfile.company!} />
        </MockAppWrapper>
      )
      expect(pushSpy).not.toBeCalledWith('/')
    })

    test("SHOULD NOT push user to dashboard WHEN they're authorised (Admin)", () => {
      render(
        <MockAppWrapper mockProfile={{ groups: ['forumm-admin'] }}>
          <OrganisationSettings name={defaultMockProfile.company!} />
        </MockAppWrapper>
      )
      expect(pushSpy).not.toBeCalledWith('/')
    })
  })
})
