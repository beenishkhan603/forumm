import { Tab, Tabs } from '@components/base/Tabs'
import { render } from '@testing-library/react'

it.each(['1', '2', '3'])('renders tabs unchanged', (activeTitle) => {
  const { container } = render(
    <Tabs activeTitle={activeTitle}>
      <Tab title="1">1</Tab>
      <Tab title="2">2</Tab>
      <Tab title="3">3</Tab>
    </Tabs>
  )
  expect(container).toMatchSnapshot()
})
