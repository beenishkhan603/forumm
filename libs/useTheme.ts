import { useQuery } from '@apollo/client'
import { THEME } from '@graphql/theme/theme'
import { Event } from '@graphql/__generated/graphql'
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import tinycolor from 'tinycolor2'
import useLocalStorage from './useLocalStorage'
import { useOrganisationProfile } from './useOrganisationProfile'

export type Theme = {
  backgroundColour?: string
  backgroundColourSecondary?: string
  foregroundColour?: string
  editorBackgroundColour: string
  backgroundColorBanner?: string
  mediaBackgroundColor?: string
  foregroundTextColour?: string
  highlightColour?: string
  logoUrl?: string
  textColour?: string
  borderColour?: string
  wheelColour?: string
  buttonColorLightBlue?: string
  successColour?: string
  tealColour?: string
  type?: 'DARK' | 'LIGHT' | 'HYBRID'
}

type ThemeContextType = {
  theme: Theme
  setTheme: React.Dispatch<React.SetStateAction<Theme>>
}

const StaticColours = {
  forumm_share_dark: '#B4CFFF',
  forumm_gray: '#45464F',
  forumm_blue: '#3763e9',
  forumm_blue_3: '##002979',
  forumm_light_blue: '#6fc7f0',
  forumm_blue_light: '#57D5FF',
  forumm_orange: '#FF9306',
  forumm_active: '#98d5c7',
  forumm_red: '#f94c4c',
  forumm_yellow: '#ebc22e',
  disabled: '#d9d9d9',
  v2: {
    light_gray: '#AEB0B3',
    light_blue: '#B9EAFF',
    dark_light_blue: '#004D62',
    blue: '#006781',
    blue_share: '#0052DD',
  },
}

export const DefaultLightTheme: Theme = {
  backgroundColour: '#FFFFFF',
  backgroundColorBanner: '#FFFFFF',
  backgroundColourSecondary: '#FFFFFF',
  editorBackgroundColour: '#FFFFFF',
  foregroundColour: '#FBFCFE',
  mediaBackgroundColor: '#45464F',
  foregroundTextColour: '#181A20',
  highlightColour: '#3763e9',
  textColour: '#181A20',
  successColour: '#2E7D32',
  borderColour: '#e5e7eb',
  wheelColour: '#B9EAFF',
  buttonColorLightBlue: '#B4CFFF',
  tealColour: '#006781',
  type: 'LIGHT',
}
export const DefaultDarkTheme: Theme = {
  backgroundColour: '#0D0E11',
  backgroundColorBanner: '#2a2a2a',
  backgroundColourSecondary: '#222227',
  editorBackgroundColour: '#1C1C1C',
  foregroundColour: '#2a2a2a',
  foregroundTextColour: '#ffffff',
  highlightColour: '#2a2a2a',
  textColour: '#ffffff',
  successColour: '#66BB6A',
  borderColour: '#ffffff',
  wheelColour: '#45494F',
  buttonColorLightBlue: '#0052DD',
  tealColour: '#00b0dc',
  type: 'DARK',
}

export const Themes: Theme[] = [DefaultLightTheme, DefaultDarkTheme]

export const DefaultTheme = DefaultLightTheme

export const ThemeContext = createContext<ThemeContextType>({
  theme: DefaultTheme,
} as ThemeContextType)

export const getContrast = (hexcolor: string) => {
  // Convert hex color to RGB
  const rgb = hexcolor.replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    function (_, r, g, b) {
      return parseInt(r, 16) + ',' + parseInt(g, 16) + ',' + parseInt(b, 16)
    }
  )

  // Calculate luminance
  const [r, g, b] = rgb.split(',').map(Number)
  const a = r * 0.2126 + g * 0.7152 + b * 0.0722
  return (a + 0.05) / (1.0 + 0.05)
}

const imageExists = async (imageUrl: URL | RequestInfo) => {
  if (!imageUrl) return false

  try {
    const response = await fetch(imageUrl, { method: 'HEAD' })
    return response.status !== 404
  } catch (error) {
    return false
  }
}

// Flag to disable refreshTheme
const themeChangeEnabled = false

export const useThemeLoader = () => {
  const { profile } = useAuth()
  const [changeColor, setChangeColor] = useState(true)
  const [savedTheme, setSavedTheme] = useLocalStorage<string>(
    'Forumm_theme',
    DefaultTheme.type!
  )

  const {
    loading: organisationLoading,
    profile: organisationData,
    ready,
  } = useOrganisationProfile(profile?.company ?? profile?.university!)

  const { setTheme, theme } = useContext(ThemeContext)

  useEffect(() => {
    if (theme.type === 'DARK' || theme.type === 'LIGHT') {
      setChangeColor(true)
    }
  }, [organisationData?.mainColour, theme.type])

  useEffect(() => {
    if (organisationData?.mainColour !== undefined && changeColor) {
      if (typeof setTheme === 'function') {
        setTheme({
          ...theme,
          highlightColour: organisationData?.mainColour,
        })
        setTimeout(() => {
          setChangeColor(false)
        }, 1000)
      }
    }
  }, [
    changeColor,
    organisationData?.mainColour,
    organisationData?.logoImage,
    organisationLoading,
    setTheme,
  ])

  const { data } = useQuery(THEME, {
    variables: {
      themeId: profile?.university ?? profile?.company!,
    },
    skip: profile?.university == null && profile?.company == null,
  })
  useEffect(() => {
    if (data || organisationData.logoImage) {
      // Dark-Light MODE is a work in progress, so this is overriding the default styling, causing strange UI/UX results. Provisionally commented
      /*const foregroundColour = data?.theme.color
      setTheme({
        foregroundColour: foregroundColour,
        highlightColour: darken(foregroundColour, 2),
        backgroundColour: darken(foregroundColour, 5),
        backgroundColourSecondary: theme.backgroundColourSecondary,
        textColour: tryGetReadableColour(foregroundColour),
        foregroundTextColour: tryGetReadableColour(foregroundColour),
        logoUrl: data?.theme.logoUrl,
        type: 'DARK',
      })*/
      const logoUrl = organisationData?.logoImage ?? data?.theme?.logoUrl

      imageExists(logoUrl!).then((logoExists) => {
        if (logoExists) {
          if (typeof setTheme === 'function') {
            setTheme((theme) => ({ ...theme, logoUrl }))
          }
        } else {
          if (typeof setTheme === 'function') {
            setTheme((theme) => ({ ...theme, logoUrl: undefined }))
          }
        }
      })
    }
  }, [
    data,
    savedTheme,
    setTheme,
    organisationData.logoImage,
    ready,
    organisationLoading,
  ])
}

export const useTheme = () => {
  const [savedTheme, setSavedTheme] = useLocalStorage<string>(
    'Forumm_theme',
    DefaultTheme.type!
  )
  const { theme, setTheme } = useContext(ThemeContext)

  const saveTheme = (t: Theme) => {
    setSavedTheme(t.type ?? DefaultTheme.type!)
    setTheme(t)
  }

  const refreshTheme = (event?: Event | undefined, newTheme?: Theme) => {
    const contrastingTextColor = tryGetReadableColour(
      event?.event?.eventBackgroundColour ?? theme.backgroundColour
    )
    const contrastingForegroundTextColor = tryGetReadableColour(
      event?.event?.eventMainColour ?? theme.foregroundColour
    )
    const coloursMatch =
      theme?.foregroundColour === event?.event?.eventMainColour &&
      theme?.textColour === contrastingTextColor

    const isTextReadalbe = tinycolor.isReadable(
      event?.event?.title ?? theme.backgroundColour!,
      contrastingTextColor,
      { level: 'AAA' }
    )

    if (
      event &&
      coloursMatch === false &&
      isTextReadalbe &&
      themeChangeEnabled
    ) {
      if (setTheme)
        setTheme({
          ...theme,
          foregroundColour:
            event?.event?.eventMainColour ?? theme.foregroundColour,
          textColour: contrastingTextColor,
          foregroundTextColour: contrastingForegroundTextColor,
          backgroundColour:
            event?.event?.eventBackgroundColour ?? theme.backgroundColour,
          highlightColour: darken(
            event?.event?.eventBackgroundColour ??
              theme.backgroundColour ??
              '#1E202F',
            2
          ),
        })
    }
  }

  const updateHighlightColour = (newHighlightColour: string) => {
    setTheme({
      ...theme,
      highlightColour: newHighlightColour,
    })
  }

  // TODO: to reenable theme, remove DefaultLightTheme line and reenable theme: theme. Also on other files to show the icon search on project for: <CustomIcon /> and uncomment
  return {
    theme: {
      ...DefaultLightTheme,
      highlightColour: theme.highlightColour,
      logoUrl: theme.logoUrl,
    },
    setTheme: saveTheme,
    refreshTheme,
    StaticColours,
    updateHighlightColour,
  }
}

export const isReadable = (fgColor: string, bgColor: string) => {
  if (!bgColor || bgColor === 'inherit' || !fgColor) return false
  return tinycolor.isReadable(fgColor, bgColor, {
    level: 'AA',
    size: 'large',
  })
}

export const tryGetReadableColour = (bgColor?: string) => {
  try {
    return tinycolor
      .mostReadable(bgColor ?? '#000', ['#000', '#FFF'], {
        level: 'AAA',
      })
      .toHexString()
  } catch (e) {
    return '#000'
  }
}

export const darken = (color: string, amount: number) => {
  try {
    const newColour = tinycolor(color).darken(amount).toHexString()
    if (newColour === color) {
      return tinycolor(color).lighten(amount).toHexString()
    }
    return newColour
  } catch (e) {
    return '#232634'
  }
}

//Recursive function to get the nearest parent with a non transparent background color.
export const getParentBg = (ele: Element): string => {
  if (!ele.parentElement) {
    return window.getComputedStyle(ele).backgroundColor
  }
  let parentBg = window.getComputedStyle(ele.parentElement).backgroundColor
  if (['inherit', 'rgba(0, 0, 0, 0)'].includes(parentBg)) {
    return getParentBg(ele.parentElement)
  }
  return parentBg
}
