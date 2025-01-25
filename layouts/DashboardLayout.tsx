import EventChatBox from '@components/chat/EventChatBox'
import { AnimatePresence } from 'framer-motion'
import Wrapper from './Wrapper'
import { useAuth } from '@libs/useAuth'
import Box from '@components/base/Box'
import useLogger from '@libs/useLogger'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuth()

  return (
    <Wrapper
      className="h-screen"
      wrapperClasses="flex flex-col flex-1"
      showFooter={false}
    >
      <AnimatePresence mode="wait">
        <Box className="flex flex-1">
          {children}
          <EventChatBox
            showEventPeopleTab={true}
            showUniversityUsers={true}
            defaultChatName={
              profile?.university != null || profile?.company != null
                ? `${profile?.university ?? profile?.company} Chat`
                : 'General Chat'
            }
            defaultChatId={
              profile?.university != null || profile?.company != null
                ? `${profile?.university ?? profile?.company}-general`
                : 'general-chat'
            }
          />
        </Box>
      </AnimatePresence>
    </Wrapper>
  )
}

export default DashboardLayout
