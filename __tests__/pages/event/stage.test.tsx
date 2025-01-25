import { render, screen, waitFor } from '@testing-library/react'
import StageView from 'pages/event/[eventId]/stages/[stageId]'
import MockAppWrapper from '__mocks__/MockAppWrapper'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: {
        preview: false,
        eventId: '87ac4ba3-7a49-41bc-86b5-9cf680f6c28d',
        stageId: 'Main%20Demo%20Event',
      },
      pathname: 'event/stages',
      push: jest.fn(),
    }
  },
}))

it.skip('SHOULD show "Enter Green Room" button IF the user is a speaker ', async () => {
  render(
    <MockAppWrapper>
      <StageView />
    </MockAppWrapper>
  )
  screen.debug(undefined, 10000)
  await waitFor(async () => {
    const loadingIndicator = screen.findByTestId('loading')
    await Promise.resolve()
    expect(loadingIndicator).not.toBeInTheDocument()
  })
  /* await waitFor(() => { */
  /*   expect(screen.queryByText('Main Demo Event')).toBeInTheDocument() */
  /* }) */
  /* act(() => { */
  /*   fireEvent.click(screen.getByText('Main Demo Event')) */
  /* }) */
  /* await waitFor(() => { */
  /*   expect(screen.queryByText('Enter Green Room')).toBeInTheDocument() */
  /* }) */
})
