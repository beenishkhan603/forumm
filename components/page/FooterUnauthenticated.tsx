import moment from 'moment'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import ForummLogoText from '@public/images/ForumLogoText.svg'
import ForummLogo from '@public/images/ForummLogo.svg'
import LinkedinLogo from '@public/images/LinkedinLogoAlt.svg'
// import FacebookLogo from '@public/images/FacebookLogoAlt.svg'
import InstagramLogo from '@public/images/InstagramLogoAlt.svg'
// import XLogo from '@public/images/XLogoAlt.svg'
import Link from 'next/link'

interface FooterLinkBase {
  label: string
}

interface FooterLinkInternal extends FooterLinkBase {
  path: string
}

interface FooterLinkExternal extends FooterLinkBase {
  url: string
}

const links: (FooterLinkInternal | FooterLinkExternal)[] = [
  {
    label: 'Privacy Notice',
    path: '/privacy',
  },
]

const FooterUnauthenticated = ({
  transparent = true,
}: {
  transparent: boolean
}) => {
  return (
    <Box
      className={`flex w-full min-h-[270px] p-28 justify-center ${
        transparent ? '' : 'bg-forumm-blue-dark '
      }${window.self !== window.top ? 'hidden' : ''}`}
    >
      <Box className="flex flex-col w-auto sm:w-1/3 justify-center text-center">
        <Box className="flex w-full justify-center">
          <ForummLogo height={48} width={48} />
          <ForummLogoText
            height={36}
            width={120}
            fill="white"
            className="mr-2 mt-1.5"
          />
        </Box>
        <Box className="mt-1">
          <Text className="!text-white font-normal">
            Event management & fundraising made simple.
          </Text>
        </Box>
        <Box className="mt-1 flex flex-row justify-center text-center">
          <Link
            href="https://www.linkedin.com/company/68805696/admin/feed/posts/"
            target="_blank"
          >
            <LinkedinLogo
              height={28}
              width={28}
              className="mr-3 cursor-pointer"
            />
          </Link>
          {/* <Link href="https://twitter.com/ForummOfficial" target="_blank"> */}
          {/*   <XLogo height={28} width={28} className="mr-3" /> */}
          {/* </Link> */}
          {/* <Link href="https://www.facebook.com/forummofficial/" target="_blank"> */}
          {/*   <FacebookLogo height={28} width={28} className="mr-3" /> */}
          {/* </Link> */}
          <Link
            href="https://www.instagram.com/forummofficial/"
            target="_blank"
          >
            <InstagramLogo height={28} width={28} />
          </Link>
        </Box>
        <Box className="mt-0 flex items-center justify-center flex-col sm:flex-row">
          {links.map((link, index) => {
            return (
              <Box key={`footer-link-key-${index}`}>
                <Link
                  href={'path' in link ? link.path : link.url}
                  target="_blank"
                  className="mx-0 sm:mx-0"
                >
                  <Text className="text-md !text-white font-regular">
                    {link.label}
                  </Text>
                </Link>
                {index + 1 < links.length && (
                  <Text className="!text-white mx-2 hidden sm:inline-block">
                    |
                  </Text>
                )}
              </Box>
            )
          })}
        </Box>
        <Box className="mt-15">
          <Text className="text-md !text-white font-regular">
            © Forumm {moment().format('YYYY')}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default FooterUnauthenticated
