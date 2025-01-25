import ProfileImage from '@components/base/ProfileImage'
import Table from '@components/base/Table'
import { render } from '@testing-library/react'

it('renders table unchanged', () => {
  const { container } = render(
    <Table
      tableHeading={['Name', 'Email', '']}
      rows={[
        ['John', 'john.doe@gmail.com', <div key={1}>Actions</div>],
        ['Pete', 'pete.doe@gmail.com', <div key={2}>Actions</div>],
      ]}
    />
  )
  expect(container).toMatchSnapshot()
})
