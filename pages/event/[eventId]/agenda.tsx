import ActionButtons from '@components/chat/ActionButtons'
import AnimatedView from '@components/event/AnimatedView'
import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import { SessionList } from '@components/event/SessionList'
import { useTheme } from '@libs/useTheme'
import LiveEventLayout from '@layouts/LiveEventLayout'
import { useEvent } from '@libs/useEvent'
import CalendarIcon from '@public/images/CalendarIcon.svg'
import DefaultThumbnail from '@public/images/default-thumbnail.png'
import moment, { Moment } from 'moment'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { StagesCarousel } from '../../../components/event/StagesCarousel'
import ProfileImage from '@components/base/ProfileImage'
import { parseTextWithLink } from '@libs/Utility/parsers'
import { getDynamicStyle } from '@libs/Utility/util'
import useStatistics from '@libs/useStatistics'
import RichTextDisplay from '@components/base/RichTextDisplay'
import { MdExitToApp } from 'react-icons/md'
import { useEffect, useState } from 'react'
import useLocalStorage from '@libs/useLocalStorage'
import Modal from '@components/base/Modal'
import { EventSpeaker } from '@graphql/__generated/graphql'
import { GoArrowRight } from 'react-icons/go'

export default function LiveEventPage() {
  const { event } = useEvent()
  const { theme } = useTheme()
  const router = useRouter()
  const dynamicStyle = getDynamicStyle(theme.highlightColour)
  const _statisticId = useStatistics()
  const [shouldStageRedirect, setStageRedirect] = useLocalStorage<
    [boolean, Moment | undefined]
  >('Forumm_stage_redirect', [true, undefined])
  const isDarkTheme = theme.type === 'DARK'

  const userData = router.query.ud

  useEffect(() => {
    if (!event) return
    const liveStage = event.stages?.find((s) => s.isLive)
    if (!!liveStage && shouldStageRedirect[0] === true) {
      setStageRedirect([false, moment().add(1, 'hour')])
      router.push(
        `/event/${event.eventId}/stages/${encodeURIComponent(liveStage.title)}`
      )
    }
    try {
      if (
        !shouldStageRedirect[0] &&
        moment(shouldStageRedirect[1]).isBefore(moment())
      )
        setStageRedirect([true, undefined])
    } catch (e) {
      console.error(e)
    }
  }, [])

  const getSocialIcon = (platform: string) => {
    if (platform.toLowerCase() === 'facebook')
      return <FaFacebook className="h-8 w-8 my-1 mr-2 cursor-pointer" />
    if (platform.toLowerCase() === 'twitter')
      return <FaTwitter className="h-8 w-8 my-1 mr-2 cursor-pointer" />
    if (platform.toLowerCase() === 'instagram')
      return <FaInstagram className="h-8 w-8 my-1 mr-2 cursor-pointer" />
    if (platform.toLowerCase() === 'linkedin')
      return <FaLinkedin className="h-8 w-8 my-1 mr-2 cursor-pointer" />

    return <FaFacebook className="h-8 w-8 my-1 mr-2 cursor-pointer" />
  }

  let videoUrl =
    'https://forumm-images-prod.s3.eu-west-1.amazonaws.com/user-content/manual-upload/video-background.mp4'

  // Temporary contented custom bg video
  if (event?.eventId === 'c987cfd9-3732-4d21-a586-293ed6d36784') {
    videoUrl =
      'https://forumm-images-prod.s3.eu-west-1.amazonaws.com/user-content/manual-upload/video-background_CE.mp4'
  }

  const [showSpeakerModal, setShowSpeakerModal] = useState<boolean>(false)
  const [selectedSpeaker, setSelectedSpeaker] = useState<
    EventSpeaker | undefined
  >(undefined)

  const speakerModal = (
    <Modal
      show={showSpeakerModal}
      setShow={(val) => {
        setSelectedSpeaker(undefined)
        setShowSpeakerModal(val)
      }}
      closeButton={true}
      title={`Speaker ${selectedSpeaker?.name ?? 'Insight'}`}
      className={`!max-w-[30rem] !min-w-[10rem]`}
    >
      <Box
        className="p-8 flex flex-col items-center rounded-lg sm:min-h-[310px]"
        ignoreTheme
      >
        <ProfileImage imageUrl={selectedSpeaker?.profileImage} size="lg" />
        <Box className="mt-4 font-semibold text-sm" ignoreTheme>
          {selectedSpeaker?.position}
        </Box>
        <Box className="mt-2 font-bold text-md " ignoreTheme>
          {selectedSpeaker?.name}
        </Box>
        <Box className="mt-2 text-gray-600" ignoreTheme>
          {selectedSpeaker?.organization}
        </Box>
        {selectedSpeaker?.bio && (
          <Box className="mt-8 text-gray-700" ignoreTheme>
            {parseTextWithLink(selectedSpeaker?.bio)}
          </Box>
        )}
      </Box>
    </Modal>
  )

  return (
    <AnimatedView
      className={`-mt-[80px] pt-[80px] overflow-x-hidden h-[calc(100vh)] relative`}
    >
      {speakerModal}
      <Box
        color="foregroundColour"
        style={dynamicStyle as unknown as {}}
        className={`pb-9 border-b border-forumm-menu-border relative`}
      >
        <Box className="absolute w-full h-[420px]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover select-none no-controls"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </Box>
        <Box className="flex flex-col items-center justify-center">
          <Box className="mt-10 mb-64 z-10 w-full md:w-[85%] max-w-[1500px]">
            <Box
              className={`rounded-2xl shadow-lg flex flex-col p-4 md:p-6 md:px-8 md:py-4 md:pt-6 ${
                isDarkTheme
                  ? 'border border-forumm-menu-border'
                  : 'border border-forumm-menu-border'
              }`}
              style={{
                background: isDarkTheme
                  ? 'rgba(42, 42, 42, 0.6)'
                  : 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
              }}
            >
              <Box className="flex flex-col sm:flex-row w-full bg-transparent">
                <Box className="order-2 sm:order-1 text-white text-3xl md:text-4xl font-bold mr-2">
                  {event?.event?.title}
                </Box>
                <Box className="order-1 sm:order-2 ml-auto flex-shrink-0 mb-2">
                  <Button
                    size="auto"
                    icon={<MdExitToApp />}
                    iconColor={theme.highlightColour as string}
                    iconPos="end"
                    type="tertiary"
                    title="Exit Event Hub"
                    className="inline bg-color-transparent border-none"
                    style={{
                      color: theme.highlightColour,
                    }}
                    onClick={() => {
                      router.push('/dashboard')
                    }}
                  />
                </Box>
              </Box>
              <Box className="flex items-center mt-8 flex-wrap">
                <Box className="text-gray-200 flex items-center mr-4">
                  <Image
                    alt="Banner"
                    className="inline-block h-10 w-10 object-cover mr-4 rounded-full"
                    src={event?.event?.thumbnailImage ?? DefaultThumbnail}
                    height={384}
                    width={1000}
                  />
                  <span>Hosted by</span>
                  <span className="font-bold ml-2">
                    {event?.event?.organizationName}
                  </span>
                </Box>
                <Box className="flex space-x-2 items-center">
                  <CalendarIcon
                    className="w-10 h-10"
                    fill={isDarkTheme ? '#FFF' : '#000'}
                  />
                  <span className="font-bold">
                    {moment(event?.event?.startDateTime).format(
                      'MMM DD, h:mmA'
                    )}{' '}
                    to{' '}
                    {moment(event?.event?.endDateTime).format('MMM DD, h:mmA')}
                  </span>
                </Box>
              </Box>{' '}
              <Box className="text-white mt-8 text-2xl font-medium">Stages</Box>
              {(!event?.stages || event?.stages?.length === 0) && (
                <Box className="my-8">
                  No stages have been added for this event yet. Check back soon!
                </Box>
              )}
              <StagesCarousel stages={event!.stages!} />
            </Box>

            {/* <Box className="flex items-center justify-start text-white mt-6 flex-wrap">
              {event?.communications?.socials?.map((s) => {
                return (
                  <motion.div whileHover={{ scale: 1 }} key={s.platform}>
                    <Link
                      href={s.url}
                      target={'_blank'}
                      data-testid="social-facebook"
                    >
                      {getSocialIcon(s.platform)}
                    </Link>
                  </motion.div>
                )
              })}
            </Box> */}
            <Box
              color="foregroundColour"
              className="rounded-2xl flex flex-col p-10 border border-forumm-menu-border flex-2 mt-2"
            >
              <Box className="text-white text-2xl font-medium">Description</Box>
              <Box className="mt-4 text-white">
                {event?.event?.description ? (
                  <RichTextDisplay descriptionJson={event.event.description} />
                ) : (
                  'No description provided.'
                )}
              </Box>
            </Box>
            <Box
              color="foregroundColour"
              className="rounded-2xl flex mt-8 flex-col p-10 border border-forumm-menu-border flex-2"
            >
              <SessionList
                sessions={event!.sessions ?? []}
                eventId={event?.eventId!}
              />
            </Box>
            <Box
              color="foregroundColour"
              className="rounded-2xl flex flex-col p-10 border border-forumm-menu-border flex-2 mt-8"
            >
              <Box className="text-white text-2xl font-medium">Speakers</Box>
              {(!event?.speakers || event?.speakers?.length === 0) && (
                <Box className="my-8">
                  No speakers have been added for this event yet. Check back
                  soon!
                </Box>
              )}
              <Box className="flex flex-wrap my-8 -mx-4 justify-center">
                {event?.speakers?.map((s) => (
                  <Box
                    className="p-4 flex-1 max-w-xs text-center min-w-[20rem]"
                    key={s.name}
                    ignoreTheme
                  >
                    <Box
                      className="bg-midnight-sky pt-8 p-4 flex flex-col items-center text-white rounded-lg sm:min-h-[310px] cursor-pointer"
                      ignoreTheme
                      onClick={() => {
                        setShowSpeakerModal(false)
                        setSelectedSpeaker(s)
                        setShowSpeakerModal(true)
                      }}
                    >
                      <ProfileImage imageUrl={s?.profileImage} size="lg" />
                      <Box className="mt-8 text-white" ignoreTheme>
                        {s?.name}
                      </Box>
                      <Box className="mt-4 text-white" ignoreTheme>
                        {s?.position}
                      </Box>
                      <Box className="mt-8 text-gray-200" ignoreTheme>
                        {s?.organization}
                      </Box>
                      <Box
                        className="mt-8 text-white font-light text-sm ml-auto flex items-center"
                        ignoreTheme
                      >
                        {/* View More */}
                        <GoArrowRight className="ml-2 h-full" />
                      </Box>
                      {/* {s?.bio && ( */}
                      {/*   <Box className="mt-8 text-gray-200" ignoreTheme> */}
                      {/*     {parseTextWithLink(s?.bio)} */}
                      {/*   </Box> */}
                      {/* )} */}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          <ActionButtons />
        </Box>
      </Box>
    </AnimatedView>
  )
}

LiveEventPage.Layout = LiveEventLayout
