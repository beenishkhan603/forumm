import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { EventCreation } from './CreateEventContext'

const useAutosave = (formData?: Partial<EventCreation>) => {
  const router = useRouter()

  const hasDataChanged = (dataToCompare: any) => {
    if (JSON.stringify(formData) === JSON.stringify(dataToCompare))
      return setHasEdited(false)
    return setHasEdited(true)
  }

  const getHasEdited = () =>
    window.localStorage.getItem('Forumm_FormEditedState') === 'true'

  const setHasEdited = async (val: boolean): Promise<boolean> =>
    new Promise((res, rej) => {
      try {
        window.localStorage.setItem(
          'Forumm_FormEditedState',
          !!val ? 'true' : 'false'
        )
        res(true)
      } catch (err) {
        console.error(err)
        rej(false)
      }
    })

  //Route change event listener
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (
        router.pathname !== url &&
        window.localStorage.getItem('Forumm_FormEditedState') === 'true'
      ) {
        router.events.emit('routeChangeError', 'UNSAVED CONTENT ERROR', url)
        throw 'Abort route change. Please ignore this error.'
      }
    }

    const handleRouteError = () => {
      console.error(`Route change failed`)
    }

    /* router.events.on('routeChangeStart', handleRouteChange) */
    /* router.events.on('routeChangeError', handleRouteError) */

    return () => {
      /* router.events.off('routeChangeStart', handleRouteChange) */
      /* router.events.off('routeChangeError', handleRouteError) */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return {
    getHasEdited,
    setHasEdited,
    hasDataChanged,
  }
}

export default useAutosave
