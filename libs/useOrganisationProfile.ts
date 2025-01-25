import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ORGANISATION_BY_NAME } from '@graphql/organisation/getOrganisationByName'

const DEFAULT_PROFILE = {
  currency: 'GBP',
  percentage: 10,
  name: '',
}

export type OrganizationType = {
  currency: string
  name?: string
  organisationType?: string
  bannerImage?: string
  logoImage?: string
  mainColour?: string
  percentage?: number
  headerTextOne?: string
  headerTextTwo?: string
  dashboardPopupDoNotShowAgain?: boolean
}

interface OrganisationProfileResult {
  loading: boolean
  profile: OrganizationType
  error?: Error
  ready: boolean
  refetchOrganisation: () => void
}

export const useOrganisationProfile = (
  name: string
): OrganisationProfileResult => {
  const { loading, data, error, refetch } = useQuery(GET_ORGANISATION_BY_NAME, {
    variables: { name },
    skip: !name,
  })
  const [result, setResult] = useState<OrganisationProfileResult>({
    loading: true,
    profile: { ...DEFAULT_PROFILE, name },
    refetchOrganisation: () => {},
    ready: false,
  })
  useEffect(() => {
    if (!loading && data?.getOrganisationByName)
      setResult({
        loading: false,
        profile: data?.getOrganisationByName as OrganizationType,
        refetchOrganisation: refetch,
        ready: true,
      })
    if (error || (!loading && !data?.getOrganisationByName))
      setResult({
        loading: false,
        profile: { ...DEFAULT_PROFILE, name },
        refetchOrganisation: refetch,
        ready: true,
      })
  }, [loading, data, error, refetch])
  return result
}
