import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import Modal from '@components/base/Modal'
import { useTheme } from '@libs/useTheme'
import ProfileImage from '@components/base/ProfileImage'
import { useAuth } from '@libs/useAuth'
import { useChat } from '@libs/useChat'
import { motion } from 'framer-motion'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { IoBusiness } from 'react-icons/io5'

const ProfileModal = () => {
  const { StaticColours } = useTheme()
  const { setDmChat, setModalUser, modalUser: profile, setChatTab } = useChat()
  const { profile: myProfile } = useAuth()

  let socialNetworks = {
    facebookAccount: '',
    instagramAccount: '',
    linkedinAccount: '',
    twitterAccount: '',
  }
  try {
    socialNetworks = JSON.parse(profile?.otherProfiles ?? '')
  } catch (_ex) {}

  const dmChatRoom = [profile?.userId, myProfile?.userId ?? 'unknown']
    .sort()
    .join('|')

  return (
    <Modal
      closeButton={true}
      show={profile !== undefined}
      setShow={(show) => {
        if (!show) {
          setModalUser?.(undefined)
        }
      }}
    >
      <Box className="flex space-x-8 text-white">
        <ProfileImage
          imageUrl={profile?.profileImage}
          activityStatus={
            profile?.isAnonymous === 'true' ? false : profile?.isActive
          }
          size="lg"
        />

        <Box className="flex flex-col space-y-2 text-white">
          <Box className="font-bold text-xl">{profile?.name}</Box>
          <Box className="flex items-center space-x-2">
            <IoBusiness />
            <span>
              {profile?.companyTitle ?? profile?.company}{' '}
              {profile?.jobTitle ? `- ${profile?.jobTitle}` : ''}
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
      <Box className="flex mt-4 w-full space-x-2 text-white">
        <Button
          onClick={() => {
            setModalUser?.(undefined)
            setDmChat?.({
              chatId: dmChatRoom,
              user: profile!,
            })
            setChatTab?.('Messages')
          }}
          title="Message"
          className="flex-1"
        />
        {/* Remove button from attendee profiles but keep functionality in backend */}
        {/* https://448-studio.atlassian.net/browse/FRM-313 */}
        {/* <Button */}
        {/*   title="Call" */}
        {/*   className="flex-1" */}
        {/*   onClick={() => { */}
        {/*     call?.(profile!) */}
        {/*     setModalUser?.(undefined) */}
        {/*   }} */}
        {/* /> */}
      </Box>
    </Modal>
  )
}

export default ProfileModal
