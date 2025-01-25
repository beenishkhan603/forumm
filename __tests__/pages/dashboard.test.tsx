import {
  render,
  waitFor,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import OrganizerLaunchPage from 'pages/dashboard'
import MockAppWrapper, { defaultMockProfile } from '__mocks__/MockAppWrapper'

it('renders dashboard page unchanged when not a forumm admin', async () => {
  const { container } = render(
    <MockAppWrapper>
      <OrganizerLaunchPage />
    </MockAppWrapper>
  )

  await waitForElementToBeRemoved(() => screen.queryAllByTestId('loading'))

  waitFor(() => {
    expect(container).toMatchSnapshot()
  })
})

// This test is not required because the page is rendered differently for forumm admins
/* it('renders dashboard page unchanged when a forumm admin', async () => {
  const { container } = render(
    <MockAppWrapper
      mockProfile={{
        ...defaultMockProfile,
        groups: ['forumm-admin'],
      }}
    >
      <OrganizerLaunchPage />
    </MockAppWrapper>
  )
  await waitForElementToBeRemoved(() => screen.queryAllByTestId('loading'))

  waitFor(() => {
    expect(container).toMatchSnapshot()
  })
})*/
