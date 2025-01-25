import { useAuth } from '@libs/useAuth'
import LoadingBar from '@components/base/LoadingBar'
import { useQuery } from '@apollo/client'
import TableOrganisers from '@components/metrics/TableOrganisers'
import { useEffect, useState } from 'react'
import { User } from '@graphql/__generated/graphql'
import { useRouter } from 'next/router'
import { GET_FULL_ORGANISERS_BY_COMPANY } from '@graphql/users/getFullOrganiserByCompany'
import OrganisationSettings from '@components/organisation/OrganisationSettings/OrganisationSettings'

export default function UserDetailsPage() {
  const { profile, isOrganizer, isAdmin, isLogged } = useAuth()
  const { push } = useRouter()
  const [organisers, setOrganisers] = useState<User[]>([])
  const org = profile?.company ?? profile?.university!
  const [isReady, setIsReady] = useState<boolean>(false)
  const [isAllowed, setIsAllowed] = useState<undefined | boolean>(undefined)

  const { data, loading } = useQuery(GET_FULL_ORGANISERS_BY_COMPANY, {
    variables: { company: org },
  })

  // const perms = getPermission('USER::ACCESS_ORGANISATION::*')

  if (!isLogged) push('/login?previous=true')

  useEffect(() => {
    let payload: User[] = []
    if (!loading && data) {
      data.getOrganiserByCompany.items.forEach((organiser) => {
        if (organiser.company === org || organiser.university === org) {
          if (
            !organiser.email.includes('forumm.to') ||
            !organiser.email.includes('448.studio')
          )
            payload.push(organiser)
        }
      })
      setOrganisers(payload)
    }
  }, [loading, data, org])

  useEffect(() => {
    if (isOrganizer !== undefined && isAdmin !== undefined) {
      setIsReady(true)
      setIsAllowed(isOrganizer || !isAdmin)
    }
  }, [isOrganizer, isAdmin])

  useEffect(() => {
    if (profile && !isOrganizer) push(`/dashboard`)
  }, [isOrganizer, profile])

  useEffect(() => {
    if (isReady && isAllowed !== undefined && isAllowed == false) push('/')
  }, [isReady, isAllowed])

  if (loading || !isReady || !profile || !isOrganizer) return <LoadingBar />

  return (
    <>
      <OrganisationSettings
        name={profile?.company || profile?.university || ''}
      />
      <TableOrganisers className={`mx-20 mb-10`} users={organisers} />
    </>
  )
}
