import { VideoGrid } from '@components/meeting/VideoContainer'
import { render, screen } from '@testing-library/react'
import { MediaTracks } from '@type/Broadcasting/Agora.type'

const userPool = (size: number = 0): any[] => new Array(size).fill('User')
const mediaTracks = (): MediaTracks => ({
  video: { camera: undefined, screen: undefined },
  audio: { camera: undefined, screen: undefined },
})

describe('Video Grid/Container Test Suite', () => {
  describe('Layout Calculations', () => {
    it.skip('SHOULD return the 3/3/3 layout WHEN 9 users are present', async () => {
      render(
        <VideoGrid
          remoteUsers={userPool(9)}
          screenShare={false}
          isVideoOn={true}
          localVideoTrack={mediaTracks().video}
          muted={false}
          isInPreStage={true}
        />
      )

      const test = screen.getByTestId('test_video_grid')
      expect(test).toBeInTheDocument()
    })
  })
})
