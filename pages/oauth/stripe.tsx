import { useMutation } from '@apollo/client'
import ForumLogoText from '@public/images/ForumLogoText.svg'
import ForummLogo from '@public/images/ForummLogo.svg'
import Box from '@components/base/Box'
import LoadingSpinner from '@components/base/LoadingSpinner'
import { LINK_MERCHANT } from '@graphql/users/linkMerchant'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { GoArrowLeft, GoArrowRight } from 'react-icons/go'

const StripeOAuth = () => {
  const [linkMerchant] = useMutation(LINK_MERCHANT)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<number | undefined>(undefined)
  const router = useRouter()
  const stripeCode =
    !!router.query.code && Array.isArray(router.query.code)
      ? router.query.code[0]
      : router.query.code
  const stripeScope =
    !!router.query.scope && Array.isArray(router.query.scope)
      ? router.query.scope[0]
      : router.query.scope

  useEffect(() => {
    console.log({ stripeCode, stripeScope })
    if (stripeCode) {
      setLoading(true)
      linkMerchant({
        variables: {
          input: {
            scope: stripeScope,
            code: stripeCode,
          },
        },
      }).then((res) => {
        setLoading(false)
        console.log({ res })
        setStatus(parseInt(res?.data?.linkMerchant?.status ?? '0'))
      })
    }
  }, [router.query])

  return (
    <Box className="flex justify-center">
      <Box className="flex flex-col space-y-6 py-8 max-2xl mx-auto px-8">
        <Box className="flex items-center gap-2 cursor-pointer flex-col">
          {loading ? (
            <LoadingSpinner size="medium" className="!h-auto" />
          ) : (
            <Box className={`w-24 h-auto`}>
              <ForummLogo />
              <ForumLogoText className={`w-24 h-auto`} />
            </Box>
          )}
        </Box>
        <Box show={loading} className="flex items-center gap-2 cursor-pointer">
          Connecting Stripe Account...
        </Box>
        <Box
          show={!loading && (status === 200 || status === 405)}
          className="flex items-center gap-2 cursor-pointer"
        >
          Stripe Account Connected.
        </Box>

        <Box
          show={!loading && status === 500}
          className="flex items-center gap-2 cursor-pointer"
        >
          We&apos;re Having issues linking your Stripe account.
        </Box>

        {/* <Box */}
        {/*   show={!loading && !status} */}
        {/*   className="flex items-center gap-2 cursor-pointer" */}
        {/* > */}
        {/*   <Box */}
        {/*     className="flex items-center gap-2 cursor-pointer" */}
        {/*     onClick={() => {}} */}
        {/*   > */}
        {/*     Link Stripe Account */}
        {/*     <GoArrowRight /> */}
        {/*   </Box> */}
        {/* </Box> */}
        {/* <Box */}
        {/*   show={!loading && !status} */}
        {/*   className="flex items-center gap-2 cursor-pointer" */}
        {/* ></Box> */}
        <Box
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <GoArrowLeft />
          Back to Dashboard
        </Box>
      </Box>
    </Box>
  )
}

export default StripeOAuth
