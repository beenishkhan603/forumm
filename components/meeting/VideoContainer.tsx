import { useQuery } from '@apollo/client'
import Text from '@components/base/Text'
import Box from '@components/base/Box'
import { GET_USERS_BY_IDS } from '@graphql/users/GetUsersByIds'
import { IAgoraRemoteSpeaker, mapAgoraUserToForummUser } from '@libs/Agora/util'
import { useAuth } from '@libs/useAuth'
import { ProfileInfo } from '@type/Hooks/useAuth/Auth.type'
import { memo, useContext, useEffect, useRef, useState } from 'react'
import { Tile } from './Tile/Tile'
import { v4 } from 'uuid'
import { toArray } from '@libs/Utility/util'
import { TileLayout, TileMap } from '@type/Broadcasting/Tile.type'
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import AudioPlayer from '@components/base/AudioPlayer'
import { MdPeople } from 'react-icons/md'
import { AgoraContext } from '@libs/Agora/AgoraContext'
import { RiLiveFill } from 'react-icons/ri'

interface MeetingLayout {
  width: number
  height: number
  margin: number
}

const testUser = {
  uid: `TEST`,
  hasAudio: false,
  hasVideo: true,
  videoTrack: undefined,
  audioTrack: undefined,
  volume: 0,
}

const isScreenClient = (user: IAgoraRTCRemoteUser) => {
  if (!user || !user.uid) return false
  return user.uid.toString().includes('screen')
}

export const VideoGrid = ({
  type = 'meet',
  isInPreStage,
  isBreakout,
}: {
  type?: 'streamer' | 'meet' | 'viewer'
  isInPreStage: boolean
  isBreakout?: boolean
}) => {
  const { profile } = useAuth()

  // Flag to include fake users for testing.
  const testMode = false

  // Number of fake users to add.
  const nTestUsers = 2

  // Number of users to show when the channel is screen sharing
  const maxUsersWithScreen = 5

  const { localData, remoteData, sessionData } = useContext(AgoraContext)

  const { localMediaTracks, isScreenSharing, isLive } = localData!

  const { remoteUsers, isRemoteScreensharing } = remoteData!

  const { speakers } = sessionData!

  const [layout, setLayout] = useState<MeetingLayout>({
    width: 0,
    height: 0,
    margin: 0,
  })

  const [tiles, setTiles] = useState<TileMap>({ user: [], screen: [] })

  const { data } = useQuery(GET_USERS_BY_IDS, {
    variables: {
      input: {
        userIds: remoteUsers
          .map((r) => r.uid.toString())
          .filter((r) => !r.includes('>screen')),
      },
    },
  })

  const usersInEvent: Array<Partial<ProfileInfo>> | undefined =
    data?.getUsersByIds.items.map((user) => {
      return {
        userId: user.userId!,
        email: user.email!,
        fullName: user.name!,
        profileImageUrl: user.profileImage ?? undefined,
        isAnonymous: user.isAnonymous ?? undefined,
        university: user.university ?? undefined,
        company: user.company ?? undefined,
      }
    })

  usersInEvent?.unshift(profile!)

  const remoteUsersWithActiveMedia = () => {
    if (!remoteUsers || remoteUsers.length < 1) return []
    const payload = remoteUsers.filter((user) => {
      if (user?.uid?.toString().includes('>screen')) {
        if (user?.hasVideo === false) return false
        if (user?.uid?.toString().slice(0, 36) === profile?.userId) return false
      }

      if (!!user.audioTrack) {
        const audioStats = user.audioTrack.getMediaStreamTrack()
        if (audioStats.readyState === 'live') return true
        if (audioStats.enabled) return true
      }

      if (!!user.videoTrack) {
        const videoStats = user.videoTrack.getMediaStreamTrack()
        if (videoStats.readyState === 'live') return true
        if (videoStats.enabled) return true
      }

      if (speakers?.find((s) => s.userId === user.uid.toString())) return true
      if (type === 'meet') return true
      return false
    })
    return payload
  }

  const testUsers = [
    ...remoteUsersWithActiveMedia(),
    ...new Array(nTestUsers).fill(testUser),
  ]

  const generateLayout = (
    override?: IAgoraRemoteSpeaker[] | any[]
  ): TileLayout => {
    const userPool = override ?? remoteUsersWithActiveMedia()
    const payload: TileLayout = { users: [], screens: [] }

    if (isInPreStage || isBreakout)
      /* Add local user to the start of the users to render array*/
      userPool.unshift({
        uid: profile?.userId,
        hasAudio: false,
        hasVideo: localMediaTracks?.video?.camera,
        videoTrack: localMediaTracks?.video?.camera,
        audioTrack: undefined,
        volume: 0,
      })

    /* Add screenshare to the users to render array*/
    if (isScreenSharing)
      userPool.unshift({
        uid: `${profile?.userId}>local_screen`,
        hasAudio: false,
        hasVideo: localMediaTracks?.video?.screen,
        videoTrack: localMediaTracks?.video?.screen,
        audioTrack: undefined,
        volume: 0,
      })

    userPool.forEach((u: IAgoraRemoteSpeaker, i) => {
      if (isScreenClient(u)) return payload.screens.push(u)
      return payload.users.push(u)
    })
    return payload
  }

  const generateTiles = (users: IAgoraRemoteSpeaker[]) => {
    if (users.length > 0) {
      let style = {
        width: `${layout.width}px`,
        height: `${layout.height}px`,
      }

      return users.map((user, i) => {
        if (isScreenClient(user)) {
          style = {
            width: `${Math.floor(100 / users.length)}%`,
            height: `100%`,
          }
        }

        if (isRemoteScreensharing && i > maxUsersWithScreen) {
          if (i === users.length - 1) {
            return (
              <Box key={'User_Stack'} className="flex relative border-none">
                <Box
                  className="flex flex-row items-center justify-center !text-white p-3 z-40"
                  style={style}
                >
                  <AudioPlayer
                    key={user.uid.toString() ?? v4()}
                    audioTrack={user.audioTrack}
                  />
                  {users.length - maxUsersWithScreen}
                  <MdPeople className="mx-2 h-6 w-6" />
                </Box>
              </Box>
            )
          }

          return (
            <AudioPlayer
              key={user.uid.toString() ?? v4()}
              audioTrack={user.audioTrack}
            />
          )
        }
        return (
          <Tile
            key={user.uid?.toString() ?? i}
            className={`rounded relative inline-block align-middle overflow-hidden self-center`}
            style={style}
            fit={`${isScreenClient(user) ? 'contain' : 'cover'}`}
            options={{
              useAudioIndicator:
                type === 'meet'
                  ? true
                  : users.length && users.length > 1
                    ? true
                    : false,
            }}
            tileData={{
              user: mapAgoraUserToForummUser(user, usersInEvent ?? [], profile),
              audioLevel: user.volume,
            }}
            mediaTracks={{
              video: {
                camera: !isScreenClient(user) ? user?.videoTrack : undefined,
                screen: isScreenClient(user) ? user?.videoTrack : undefined,
              },
              audio: {
                camera: user.audioTrack ?? undefined,
                screen: undefined,
              },
            }}
          />
        )
      })
    }
    return null
  }

  useEffect(() => {
    const layout = generateLayout(testMode ? testUsers : undefined)
    const userTiles = generateTiles(layout.users)
    const screenTiles = generateTiles(layout.screens)

    setTiles({ user: toArray(userTiles), screen: toArray(screenTiles) })
  }, [remoteUsers, localMediaTracks, layout.width])

  const flexContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ele = flexContainer.current

    const handleResize = () => {
      const containerHeight = ele?.clientHeight ?? 0
      const containerWidth = ele?.clientWidth ?? 0

      const calcMargin = () => {
        const margins = [2, 6, 10].reverse()
        const res = containerWidth
        if (res < 600) return margins[2]
        if (res < 800) return margins[1]
        return margins[0]
      }

      const tileRatio = 3 / 4
      const tileMargin = calcMargin()

      const nUsers = isRemoteScreensharing
        ? tiles.user.length - maxUsersWithScreen
        : tiles.user.length ?? 1

      let i = 1
      let maxTileWidth = 0

      const calcMaxWidth = (targetWidth: number) => {
        // The width of the current row
        let w = 0
        // the height of all rows
        let h = targetWidth * tileRatio + tileMargin * 2
        // Loops through all users
        for (let l = 0; l < nUsers; l++) {
          if (w + targetWidth > containerWidth) {
            w = 0
            h = h + targetWidth * tileRatio + tileMargin * 2
          }
          w = w + targetWidth + tileMargin * 2
        }

        if (h > containerHeight || i > containerWidth) return true
      }

      while (i < 3000) {
        if (calcMaxWidth(i)) {
          maxTileWidth = i - 1 - tileMargin * 2
          break
        }
        i++
      }
      setLayout({
        width: maxTileWidth,
        height: maxTileWidth * tileRatio,
        margin: tileMargin,
      })
    }

    const resizer = new ResizeObserver(() => {
      handleResize()
    })

    if (!!ele) resizer.observe(ele)

    handleResize()

    return () => {
      if (!!ele) resizer.unobserve(ele)
    }
  }, [tiles])

  // useEffect(() => {
  // }, [])

  return (
    <Box className="flex flex-col flex-1 relative">
      <Box show={tiles.screen.length > 0} className="flex-3">
        {tiles.screen}
      </Box>
      <Box
        innerRef={flexContainer}
        className={``}
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
          verticalAlign: 'middle',
          flexWrap: 'wrap',
          overflow: 'hidden',
          gap: `${layout.margin}px`,
        }}
      >
        {tiles.user}
      </Box>

      <Box
        show={!!isLive && type === 'streamer'}
        className={`absolute ${isRemoteScreensharing ? 'top-0' : 'bottom-0'} right-0`}
      >
        <Box className=" flex items-center justify-between border-red-600 border-4 p-2 rounded-2xl text-red-600 m-2 animate-pulse">
          <RiLiveFill className=" mx-2 size-6 text-red-600 hidden sm:inline-block" />
          <Text ignoreTheme className="text-red-600 font-bold px-2 sm:px-0">
            LIVE
          </Text>
        </Box>
      </Box>
      <Box
        show={!isLive && isInPreStage && type === 'streamer'}
        className={`absolute ${isRemoteScreensharing ? 'top-0' : 'bottom-0'} right-0`}
      >
        <Box className=" flex items-center justify-between border-green-600 border-4 p-2 rounded-2xl text-green-600 m-2 animate-pulse">
          <RiLiveFill className=" mx-2 size-6 text-green-600 hidden sm:inline-block" />
          <Text ignoreTheme className="text-green-600 font-bold px-2 sm:px-0">
            GREENROOM
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default memo(VideoGrid)
