import { useCallback, useState } from 'react'
import { useMutation } from '@apollo/client'
import crypto from 'crypto'
import useLocalStorage from '@libs/useLocalStorage'
import { CONNECT_TO_BLACKBAUD } from '@graphql/organisation/connectToBlackBaud'
import { PUSH_TO_BLACKBAUD } from '@graphql/events/pushToBlackbaud'
import { GET_BLACKBAUD_EVENT_BY_ID } from '@graphql/events/getBlackBaudEventQuery'
import { UpdatedConstituentItem } from '@components/event/BlackBaudEventModal'

interface UseBlackBaudResult {
  initiateOAuth: () => void
  onCallback: (url: string, name: string) => Promise<void>
  accessToken: string | null
  completed: boolean
  publish: (
    eventId: string,
    selection: string[],
    updatedConstituents?: UpdatedConstituentItem[] | undefined,
    blackbaudId?: string
  ) => Promise<any>
  getEvent: (eventId: string, blackbaudId?: string) => Promise<any>
}

const CLIENT_ID = process.env.NEXT_PUBLIC_BLACKBAUD_CLIENT_ID as string
const REDIRECT_URI = process.env.NEXT_PUBLIC_BLACKBAUD_REDIRECT_URI as string

export const useBlackBaud = (): UseBlackBaudResult => {
  const [connectToBlackBaud] = useMutation(CONNECT_TO_BLACKBAUD)
  const [pushToBlackbaud] = useMutation(PUSH_TO_BLACKBAUD)
  const [getBlackBaudEvent] = useMutation(GET_BLACKBAUD_EVENT_BY_ID)

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [completed, setCompleted] = useState<boolean>(false)
  const [lsCodeVerifier, setCodeVerifier] = useLocalStorage(
    'BlackBaud_CodeVerifier',
    ''
  )

  const base64URLEncode = (str: Buffer) => {
    return str
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  const initiateOAuth = useCallback(() => {
    const newState = crypto.randomBytes(48).toString('hex')
    const codeVerifier = base64URLEncode(crypto.randomBytes(32))
    setCodeVerifier(codeVerifier)
    const challengeDigest = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest()
    const newCodeChallenge = base64URLEncode(challengeDigest)

    const authUrl = `https://app.blackbaud.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&state=${newState}&code_challenge=${newCodeChallenge}&code_challenge_method=S256`

    window.location.href = authUrl
  }, [])

  const onCallback = useCallback(
    async (url: string, name: string) => {
      if (completed) return
      const urlParams = new URLSearchParams(new URL(url).search)
      const code = urlParams.get('code')
      let error = urlParams.get('error')
      if (error || !code) {
        console.error('Error during authentication: ', error)
        return
      }
      const response = await connectToBlackBaud({
        variables: {
          codeVerifier: lsCodeVerifier,
          clientId: CLIENT_ID,
          redirectUri: REDIRECT_URI,
          code,
          name,
        },
      })
      setCompleted(true)
    },
    // eslint-disable-next-line
    [connectToBlackBaud, completed, setCompleted]
  )

  const publish = useCallback(
    async (
      eventId: string,
      fields: string[],
      updatedConstituents?: UpdatedConstituentItem[] | undefined,
      blackbaudId?: string
    ) => {
      console.log('WILL PUBLISH:', {
        eventId,
        fields,
        blackbaudId,
        updatedConstituents,
      })
      return await pushToBlackbaud({
        variables: { eventId, fields, blackbaudId, updatedConstituents },
      })
    },
    [pushToBlackbaud]
  )

  const getEvent = useCallback(
    async (eventId: string, blackbaudId?: string) => {
      const response = await getBlackBaudEvent({
        variables: { eventId, blackbaudId },
      })
      return response
    },
    [pushToBlackbaud]
  )

  return {
    initiateOAuth,
    onCallback,
    accessToken,
    completed,
    publish,
    getEvent,
  }
}
