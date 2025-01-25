import { UnauthenticatedWrapperNoFooter } from '@layouts/Wrapper'
import { useAuth } from '@libs/useAuth'
import { useRouter } from 'next/router'
import Dashboard from './dashboard'

export default function Home() {
  const { isLogged } = useAuth()
  const { push } = useRouter()
  if (!isLogged) push('/login?previous=true')
  return <Dashboard />
}

Home.Layout = UnauthenticatedWrapperNoFooter
