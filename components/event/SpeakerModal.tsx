import Box from '@components/base/Box'
import Modal from '@components/base/Modal'
import { useTheme } from '@libs/useTheme'
import ProfileImage from '@components/base/ProfileImage'
import { motion } from 'framer-motion'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { IoBusiness } from 'react-icons/io5'
import { EventSpeaker } from '@graphql/__generated/graphql'

const SpeakerModal = ({
  show,
  setShow,
  speaker,
}: {
  show: boolean
  setShow: (show: boolean) => void
  speaker?: Partial<EventSpeaker>
}) => {
  const { StaticColours } = useTheme()

  let socialNetworks = {
    facebookAccount: '',
    instagramAccount: '',
    linkedinAccount: '',
    twitterAccount: '',
  }

  return (
    <Modal closeButton={true} show={show} setShow={setShow}>
      <Box className="flex space-x-8 text-white">
        <ProfileImage
          imageUrl={speaker?.profileImage}
          activityStatus={true}
          size="lg"
        />

        <Box className="flex flex-col space-y-2 text-white">
          <Box className="font-bold text-xl">{speaker?.name}</Box>
          <Box className="flex items-center space-x-2">
            <IoBusiness />
            <span>
              {speaker?.organization ?? speaker?.organization}
              {speaker?.position ? ` - ${speaker?.position}` : ''}
            </span>
          </Box>
          <Box className="flex items-center justify-center text-white mt-6 flex-wrap">
            {socialNetworks?.facebookAccount && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <a
                  href={
                    socialNetworks?.facebookAccount.startsWith('http')
                      ? socialNetworks?.facebookAccount
                      : '//' + socialNetworks?.facebookAccount
                  }
                  rel="noreferrer"
                  target={'_blank'}
                >
                  <FaFacebook
                    className="h-8 w-8 my-1 mr-2 cursor-pointer"
                    fill={StaticColours.v2.blue}
                    stroke={StaticColours.v2.blue}
                  />
                </a>
              </motion.div>
            )}
            {socialNetworks?.twitterAccount && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <a
                  href={
                    socialNetworks?.twitterAccount.startsWith('http')
                      ? socialNetworks?.twitterAccount
                      : '//' + socialNetworks?.twitterAccount
                  }
                  rel="noreferrer"
                  target={'_blank'}
                >
                  <FaTwitter
                    className="h-8 w-8 my-1 mr-2 cursor-pointer"
                    fill={StaticColours.v2.blue}
                    stroke={StaticColours.v2.blue}
                  />
                </a>
              </motion.div>
            )}
            {socialNetworks?.instagramAccount && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <a
                  href={
                    socialNetworks?.instagramAccount.startsWith('http')
                      ? socialNetworks?.instagramAccount
                      : '//' + socialNetworks?.instagramAccount
                  }
                  rel="noreferrer"
                  target={'_blank'}
                >
                  <FaInstagram
                    className="h-8 w-8 my-1 mr-2 cursor-pointer"
                    fill={StaticColours.v2.blue}
                    stroke={StaticColours.v2.blue}
                  />
                </a>
              </motion.div>
            )}
            {socialNetworks?.linkedinAccount && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <a
                  href={
                    socialNetworks?.linkedinAccount.startsWith('http')
                      ? socialNetworks?.linkedinAccount
                      : '//' + socialNetworks?.linkedinAccount
                  }
                  rel="noreferrer"
                  target={'_blank'}
                >
                  <FaLinkedin
                    className="h-8 w-8 my-1 mr-2 cursor-pointer"
                    fill={StaticColours.v2.blue}
                    stroke={StaticColours.v2.blue}
                  />
                </a>
              </motion.div>
            )}
          </Box>
        </Box>
      </Box>
      <Box
        show={!!speaker?.bio}
        className="flex mt-4 w-full space-x-2 text-white"
      >
        {speaker?.bio}
      </Box>
    </Modal>
  )
}

export default SpeakerModal
