import ProfileImage from '@components/base/ProfileImage'
import { render } from '@testing-library/react'

it.each([true, false, undefined])(
  'renders profile image unchanged',
  (status) => {
    const { container } = render(
      <ProfileImage
        size="md"
        imageUrl={'/foo.png'}
        className="foo bar"
        activityStatus={status}
      />
    )
    expect(container).toMatchSnapshot()
  }
)
