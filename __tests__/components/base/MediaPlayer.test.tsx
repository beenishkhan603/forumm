import MediaPlayer from '@components/base/MediaPlayer'
import { render, waitFor, screen } from '@testing-library/react'
import { ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng'

describe('MediaPlayer component test suite', () => {
  it('SHOULD match the snapshot', () => {
    const { container } = render(
      <MediaPlayer videoTrack={undefined} audioTrack={undefined} />
    )
    expect(container).toMatchSnapshot()
  })

  it('SHOULD play audio on load', () => {
    const audioMock = jest.fn()
    render(
      <MediaPlayer
        videoTrack={undefined}
        audioTrack={
          { play: audioMock, stop: jest.fn() } as unknown as ILocalAudioTrack
        }
      />
    )
    waitFor(async () => {
      expect(audioMock).toHaveBeenCalled()
    })
  })

  it('SHOULD start video WHEN component is mounted', () => {
    jest.mock('react', () => {
      const realModule = jest.requireActual('react')
      return {
        ...realModule,
        useRef() {
          return {
            current: true,
          }
        },
      }
    })
    const mediaMock = jest.fn()
    render(
      <MediaPlayer
        audioTrack={
          { play: jest.fn(), stop: jest.fn() } as unknown as ILocalAudioTrack
        }
        videoTrack={
          { play: mediaMock, stop: jest.fn() } as unknown as ILocalVideoTrack
        }
      />
    )
    waitFor(async () => {
      expect(mediaMock).toHaveBeenCalled()
    })
  })

  it('SHOULD not start video WHEN component isnt mounted', () => {
    jest.mock('react', () => {
      const realModule = jest.requireActual('react')
      return {
        ...realModule,
        useRef() {
          return {
            current: false,
          }
        },
      }
    })
    const mediaMock = jest.fn()
    render(
      <MediaPlayer
        audioTrack={
          { play: jest.fn(), stop: jest.fn() } as unknown as ILocalAudioTrack
        }
        videoTrack={
          { play: mediaMock, stop: jest.fn() } as unknown as ILocalVideoTrack
        }
      />
    )
    waitFor(async () => {
      expect(mediaMock).not.toHaveBeenCalled()
    })
  })
})
