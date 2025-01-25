import { useAgoraContext } from '@libs/Agora/AgoraContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '../useAuth'
import useRouterModal, { TRouterModalTuple } from './RouterModal'

type TForummRouterTuple = TRouterModalTuple

export const setUserLive = (val: boolean) =>
  window?.localStorage.setItem('Forumm_isLive', val ? 'true' : 'false')

const useForummRouter = (): TForummRouterTuple => {
  const { query, push, ...router } = useRouter()
  const { isLogged, ...auth } = useAuth()
  const [routerModal, { setModalOpen, setModalData }] = useRouterModal()
  const { actions } = useAgoraContext()

  useEffect(() => {
    setRouteConfirmed(false)
  }, [router.pathname])

  //Show confirmation pop up when attempting to leave platform or reload
  useEffect(() => {
    const stopReload = (e: BeforeUnloadEvent) => {
      if (isLogged) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', stopReload)
    return () => {
      window.removeEventListener('beforeunload', stopReload)
    }
  })

  // ### Util

  const setRouteConfirmed = (val: boolean) =>
    window?.localStorage.setItem(
      'Forumm_routeConfirmed',
      val ? 'true' : 'false'
    )

  const isUserLive = () =>
    window?.localStorage.getItem('Forumm_isLive') === 'true'

  const isRouteConfirmed = () =>
    window?.localStorage.getItem('Forumm_routeConfirmed') === 'true'

  const isLeaving = (pathToCheck: string, newURL: string) => {
    if (!router) return !newURL.includes(pathToCheck)
    return (
      router.pathname.includes(pathToCheck) && !newURL.includes(pathToCheck)
    )
  }

  const routeError = (event: string, url: string) => {
    if (!router) return
    router.events.emit('routeChangeError', event, url)
    throw 'Abort route change. Please ignore this error.'
  }

  //Route change event listener
  useEffect(() => {
    // ### Event Handlers

    const handleRouteChange = (url: string) => {
      if (!isLogged) return

      if (!router.pathname.includes('stages'))
        window.localStorage.setItem('Forumm_isLive', 'false')

      if (
        isLeaving('/stages/', url) ||
        isLeaving('/breakout-rooms/', url) ||
        isUserLive()
      ) {
        actions?.updateChannelInfo()
      }

      if (!router.pathname.includes('stages'))
        if (!isRouteConfirmed()) {
          if (isLeaving('/event/', url)) {
            routeError('EventLeaveConfirmation', url)
          }

          if (isLeaving('/breakout-rooms/', url))
            routeError('BreakoutLeaveConfirmation', url)
        }

      if (router.pathname !== url && isUserLive()) {
        routeError('LiveSpeakerRedirectError', url)
      }
    }

    const handleRouteError = (err: any, url: string) => {
      const cb = (event?: string) => {
        setRouteConfirmed(true)
        if (url.includes('/dashboard')) {
          window.location.replace(url)
          return
        }
        if (event) router.events.emit('routeChangeStart', event)
        push(url)
      }

      let title, message, callback

      switch (err) {
        case 'LiveSpeakerRedirectError':
          title = 'You are Live!'
          message = 'Please end your stream before leaving this page.'
          callback = () => cb('SpeakerLeaveConfirmed')
          break
        case 'BreakoutLeaveConfirmation':
          setRouteConfirmed(false)
          title = 'Leaving Breakout Room'
          message = 'Are you sure you want to exit the breakout room?'
          callback = () => cb('BreakoutLeaveConfirmed')
          break
        case 'EventLeaveConfirmation':
          setRouteConfirmed(false)
          title = 'Leaving Event Hub'
          message = 'Are you sure you want to exit the event hub?'
          callback = cb
          break
        default:
          title = 'Ooops..'
          message = 'An error has occurred.'
          break
      }

      if (err && err.message) {
        if (err.message === 'Cancel rendering route') return
      }

      setModalData({
        title,
        message,
        callback,
      })

      setModalOpen(true)
    }

    router?.events?.on('routeChangeStart', handleRouteChange)
    router?.events?.on('routeChangeError', handleRouteError)

    return () => {
      router?.events?.off('routeChangeStart', handleRouteChange)
      router?.events?.off('routeChangeError', handleRouteError)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return [routerModal, { setModalOpen, setModalData }]
}

export default useForummRouter
