import { ApolloProvider } from '@apollo/client'
import Image from 'next/image'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import Wrapper from '@layouts/Wrapper'
import { DefaultTheme, ThemeContext, Themes } from '@libs/useTheme'
import { useEffect, useState } from 'react'
import { Theme } from '@libs/useTheme'
import { apolloClient } from '@libs/apollo-client'
import Script from 'next/script'
import Box from '@components/base/Box'
import Head from 'next/head'
import { ProfileInfo } from '@type/Hooks/useAuth/Auth.type'
import { AuthContext } from '@libs/useAuth'
import useLocalStorage from '@libs/useLocalStorage'
export type ComponentWithPageLayout = AppProps & {
  Component: AppProps['Component'] & {
    Layout?: React.ComponentType
  }
}

function App({ Component, pageProps }: ComponentWithPageLayout) {
  const Layout = Component.Layout || Wrapper
  const [savedTheme, setSavedTheme] = useLocalStorage(
    'Forumm_theme',
    DefaultTheme.type!
  )

  const [theme, setTheme] = useState<Theme>(
    Themes.find((t) => t.type === savedTheme) ?? DefaultTheme
  )
  const [profile, setProfile] = useState<ProfileInfo | undefined>()
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <AuthContext.Provider value={{ profile, setProfile }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <ApolloProvider client={apolloClient}>
          {/* @ts-ignore */}
          <Layout>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1"
              />
              <link
                rel="icon"
                type="image/svg+xml"
                href="https://app.forumm.to/images/ForummLogo.svg"
              />
              <title>
                Forumm: Connecting Universities and Schools with Events and
                Donations
              </title>
            </Head>
            <Script id="delete-cookies" type="text/javascript">
              {`
                  document.addEventListener("DOMContentLoaded", function() {
                      const MAX_COOKIE_SIZE = 10240;
                      const cookies = document.cookie;
                      if(cookies.length >= MAX_COOKIE_SIZE) {
                          const cookiesArray = cookies.split("; ");
                          for (let i = 0; i < cookiesArray.length; i++) {
                              const cookieName = cookiesArray[i].split("=")[0];
                              document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                          }
                          location.reload();
                      }
                  });
                `}
            </Script>
            {/* Hotjar Tracking Code */}
            <Script id="hotjar-tracking" type="text/javascript">
              {`
                (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:3796539,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              `}
            </Script>
            <Script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-KMN6R1WM4K"
            />
            <Script id="google-analytics">
              {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KMN6R1WM4K');
        `}
            </Script>
            <Script id="tawk-chat-bot-2">
              {`
                var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/64f08b97a91e863a5c10dcd6/1h95q2ifn';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
                })();

                Tawk_API.onLoad = function(){
                    //Tawk_API.hideWidget();
                };
              `}
            </Script>

            <Script id="linkedin-pixel">
              {` _linkedin_partner_id = "5263130";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);`}
            </Script>
            <Script id="linkedin-pixel-2">
              {`           (function(l) {
if (!l){window.lintrk = function(a, b) { window.lintrk.q.push([a, b]) };
window.lintrk.q=[]}
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);
`}
            </Script>
            <Script id="meta-pixel">
              {`

!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod ?
                n.callMethod.apply(n, arguments) : n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '708343351129882');
              fbq('track', 'PageView');
`}
            </Script>
            <noscript>
              <Image
                height="1"
                width="1"
                style={{ display: 'none' }}
                src="https://www.facebook.com/tr?id=708343351129882&ev=PageView&noscript=1"
                alt=""
              />
              <Image
                height="1"
                width="1"
                style={{ display: 'none' }}
                alt=""
                src="https://px.ads.linkedin.com/collect/?pid=5263130&fmt=gif"
              />
            </noscript>

            {/* @ts-ignore */}
            <Component {...pageProps} />
          </Layout>
          <Box id="modal-root" />
        </ApolloProvider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  )
}

export default App
