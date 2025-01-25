import Modal from '@components/base/Modal'
import { render } from '@testing-library/react'

it.each([false, true])(
  'renders modal unchanged (without close button)',
  (show) => {
    const { container } = render(
      <>
        <div id="modal-root" />
        <Modal closeButton={false} show={show} setShow={() => {}}>
          Lorem Ipsum...
        </Modal>
      </>
    )
    expect(container).toMatchSnapshot()
  }
)

it.each([false, true])(
  'renders modal unchanged (with close button)',
  (show) => {
    const { container } = render(
      <>
        <div id="modal-root" />
        <Modal closeButton={true} show={show} setShow={() => {}}>
          Lorem Ipsum...
        </Modal>
      </>
    )
    expect(container).toMatchSnapshot()
  }
)

it.each([false, true])('renders modal unchanged (with title)', (show) => {
  const { container } = render(
    <>
      <div id="modal-root" />
      <Modal
        closeButton={true}
        show={show}
        title={'Modal Title'}
        setShow={() => {}}
      >
        Lorem Ipsum...
      </Modal>
    </>
  )
  expect(container).toMatchSnapshot()
})

it('SHOULD not call mocked animate fucntion WHEN animating prop is not passed', () => {
  const mock = jest.fn()
  render(
    <>
      <div id="modal-root" />
      <Modal
        closeButton={true}
        show={true}
        title={'Modal Title'}
        setShow={() => {}}
      >
        Lorem Ipsum...
      </Modal>
    </>
  )
  expect(mock).not.toBeCalled()
})

it('SHOULD call mocked animate fucntion WHEN animating prop is passed', () => {
  const mock = jest.fn()
  render(
    <>
      <div id="modal-root" />
      <Modal
        closeButton={true}
        show={true}
        title={'Modal Title'}
        setShow={() => {}}
        animating={mock}
      >
        Lorem Ipsum...
      </Modal>
    </>
  )
  expect(mock).toBeCalledWith(true)
})
