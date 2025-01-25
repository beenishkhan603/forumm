import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import { render } from '@testing-library/react'

const BG_FORUM_BLUE = 'background-color: rgb(55, 99, 233)'

describe('Button Test Suite', () => {
  it('Button test', () => {
    const { container } = render(
      <Box className="bg-black">
        <Button
          show={true}
          type="primary"
          className={''}
          iconColor={''}
          backgroundColor={''}
          textColor={''}
        />
      </Box>
    )
    const button = container.getElementsByTagName('button')[0]

    console.log(button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveStyle(BG_FORUM_BLUE)
    // expect(button).toHaveStyle('color: ButtonText;')

    expect(container).toMatchSnapshot()
  })

  it('Button test', () => {
    const { container } = render(
      <Box className="bg-black">
        <Button
          show={true}
          className={undefined}
          iconColor={undefined}
          backgroundColor={'#f1f1f1'}
          textColor={'#1F1F1F'}
        />
      </Box>
    )
    const button = container.getElementsByTagName('button')[0]

    console.log({ button, style: button.style })

    expect(button).toBeInTheDocument()
    expect(button).not.toHaveStyle(BG_FORUM_BLUE)
    // expect(button).toHaveStyle('color: #1F1F1F')

    expect(container).toMatchSnapshot()
  })
})
