const colors = require('tailwindcss/colors')
const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette')
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      xs: '320px',
      ...defaultTheme.screens,
    },
    extend: {
      keyframes: {
        'text-focus-in': {
          '0%': {
            filter: 'blur(12px)',
            opacity: '0',
          },
          '100%': {
            filter: 'blur(0px)',
            opacity: '1',
          },
        },
        scroll: {
          to: {
            transform: 'translate(calc(-50% - 0.5rem))',
          },
        },
        vibrate: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'slit-in-horizontal': {
          '0%': {
            transform: 'translateZ(-800px) rotateX(90deg)',
            opacity: '0',
          },
          '54%': {
            transform: 'translateZ(-160px) rotateX(87deg)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateZ(0) rotateX(0)',
          },
        },
        'slide-in-bck-center': {
          '0%': {
            transform: 'translateZ(600px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateZ(0)',
            opacity: '1',
          },
        },
        'jello-horizontal': {
          '0%': {
            transform: 'scale3d(1, 1, 1)',
          },
          '30%': {
            transform: 'scale3d(1.05, 0.75, 1)',
          },
          '40%': {
            transform: 'scale3d(0.75, 1.05, 1)',
          },
          '50%': {
            transform: 'scale3d(1.02, 0.85, 1)',
          },
          '65%': {
            transform: 'scale3d(0.95, 1.05, 1)',
          },
          '75%': {
            transform: 'scale3d(1.02, 0.95, 1)',
          },
          '100%': {
            transform: 'scale3d(1, 1, 1)',
          },
        },
        'jello-vertical': {
          '0%, 100%': { transform: 'scale3d(1, 1, 1)' },
          '30%': { transform: 'scale3d(0.9, 1.1, 1)' },
          '40%': { transform: 'scale3d(1.1, 0.9, 1)' },
          '50%': { transform: 'scale3d(0.95, 1.05, 1)' },
          '65%': { transform: 'scale3d(1.02, 0.98, 1)' },
          '75%': { transform: 'scale3d(0.98, 1.02, 1)' },
        },
        'bg-pan-right': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '100%': {
            backgroundPosition: '100% 50%',
          },
        },
        'kenburns-bottom-right': {
          '0%': {
            transform: 'scale(1) translate(0, 0)',
            transformOrigin: '84% 84%',
          },
          '100%': {
            transform: 'scale(1.25) translate(20px, 15px)',
            transformOrigin: 'right bottom',
          },
        },
        'color-change-3x': {
          '0%': {
            backgroundColor: 'var(--color-change-start, #3763E9)',
          },
          '50%': {
            backgroundColor: 'var(--color-change-middle, #6FC7F0)',
          },
          '100%': {
            backgroundColor: 'var(--color-change-end, #7BECCD)',
          },
          'rotate-in-2-cw': {
            '0%': {
              transform: 'rotate(-45deg)',
              opacity: '0',
            },
            '100%': {
              transform: 'rotate(0)',
              opacity: '1',
            },
          },
        },
        'slit-in-vertical': {
          '0%': {
            transform: 'translateZ(-800px) rotateY(90deg)',
            opacity: '0',
          },
          '54%': {
            transform: 'translateZ(-160px) rotateY(87deg)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateZ(0) rotateY(0)',
          },
        },
        heartbeat: {
          from: {
            transform: 'scale(1)',
            transformOrigin: 'center center',
            animationTimingFunction: 'ease-out',
          },
          '10%': {
            transform: 'scale(0.95)', // Less shrink
            animationTimingFunction: 'ease-in',
          },
          '17%': {
            transform: 'scale(0.99)', // Closer to the original size
            animationTimingFunction: 'ease-out',
          },
          '33%': {
            transform: 'scale(0.93)', // Less shrink
            animationTimingFunction: 'ease-in',
          },
          '45%': {
            transform: 'scale(1)', // Return to original size more smoothly
            animationTimingFunction: 'ease-out',
          },
        },
        'scale-up-center': {
          '0%': { transform: 'scale(0.5)' },
          '100%': { transform: 'scale(1)' },
        },
        moveHorizontal: {
          '0%': {
            transform: 'translateX(-50%) translateY(-10%)',
          },
          '50%': {
            transform: 'translateX(50%) translateY(10%)',
          },
          '100%': {
            transform: 'translateX(-50%) translateY(-10%)',
          },
        },
        moveInCircle: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '50%': {
            transform: 'rotate(180deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        moveVertical: {
          '0%': {
            transform: 'translateY(-50%)',
          },
          '50%': {
            transform: 'translateY(50%)',
          },
          '100%': {
            transform: 'translateY(-50%)',
          },
        },
      },
      animation: {
        'text-focus-in':
          'text-focus-in 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both',
        vibrate: 'vibrate 0.3s linear infinite both',
        'slit-in-horizontal': 'slit-in-horizontal 1s ease-out both',
        'slide-in-bck-center':
          'slide-in-bck-center 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        'jello-horizontal': 'jello-horizontal 0.9s both',
        'bg-pan-right': 'bg-pan-right 8s infinite both',
        'kenburns-bottom-right':
          'kenburns-bottom-right 5s ease-out infinite alternate-reverse both',
        'color-change-3x': 'color-change-3x 4s linear infinite alternate both',
        'rotate-in-2-cw':
          'rotate-in-2-cw 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        'slit-in-vertical': 'slit-in-vertical 0.45s ease-out both',
        heartbeat: 'heartbeat 1.5s ease-in-out infinite both',
        'scale-up-center':
          'scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both',
        'jello-vertical': 'jello-vertical 0.9s both',
        first: 'moveVertical 30s ease infinite',
        second: 'moveInCircle 20s reverse infinite',
        third: 'moveInCircle 40s linear infinite',
        fourth: 'moveHorizontal 40s ease infinite',
        fifth: 'moveInCircle 20s ease infinite',
        scroll:
          'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
      },
      screens: {
        'max-h-700': { raw: '(max-height: 700px)' },
      },
      fontFamily: {
        sans: ['Inter'],
        poppins: ['Inter'],
      },
      fontSize: {
        '2xs': '0.641rem',
        base: '0.875rem',
      },
      width: {
        15: '3.75rem', // 3.75rem corresponds to 60px
      },
      height: {
        13: '3.35rem',
        15: '3.75rem',
        160: '40rem',
      },
      gridTemplateColumns: {
        7: 'repeat(7, minmax(0, 1fr))',
      },
      backgroundPosition: {
        'left-top': 'left top',
        'center-top': 'center top',
      },
      colors: {
        'midnight-sky': '#232634',
        'midnight-dark': '#1E202F',
        'midnight-gray': '#C0C0C0',
        'midnight-light': '#46494F',
        'midnight-light2': '#B4C5FF',
        'forumm-blue': '#3763e9',
        'forumm-light-blue': '#6DCDF5',
        'forumm-light-blue-dark': '#B4CFFF',
        'forumm-active-blue': '#3763e9',
        'forumm-text-blue-dark': '#002C79',
        'forumm-text-deep-teal-blue': '#0A4963',
        'forumm-text-black': '#181A2',
        'forumm-gray': '#9ca0af',
        'panel-gray': '#363A49',
        'forumm-orange': '#FF9306',
        'blackbaud': '#07b28b',
        'forumm-active': '#98d5c7',
        'forumm-red': '#f94c4c',
        'forumm-yellow': '#ebc22e',
        'forumm-blue-2': '#3763e9',
        'forumm-menu-light-blue': '#f2f6fc',
        'forumm-menu-border': '#c6c6d0',
        'forumm-green': '#006B59',
        'forumm-selected-menu-blue': '#0052DD',
        'forumm-signup-gray-help': '#647b9c',
        'forumm-blue-button-hover': '#4b77fd',
        'forumm-white': '#f5f7fd',
        'forumm-dark-2': '#0d0e11',
        'forumm-light-gray': '#E1E4ED',
        link: '#3763e9',
      },
      borderColor: {
        dark: '#1B1B1F',
        light: '#e5e7eb',
        'forumm-gray': '#828695',
        'disabled-border': 'rgba(27, 27, 31, 0.38)',
        'forumm-blue': '#3763e9',
      },
      backgroundColor: {
        dark: '#1B1B1F',
        light: '#ffffff',
        'forumm-gray': '#45464F',
        'forumm-blue-light': '#57D5FF',
        'forumm-blue-light-2': '#B9EAFF',
        'forumm-blue-light-3': '#07c2ed',
        'forumm-blue-2': '#3763e9',
        'forumm-blue-dark': '#002979',
        'disabled-bg': 'rgba(29, 27, 32, 0.12)',
        'forumm-dark': '#45494F',
        'forumm-dark-card': '#181A20',
        'white-transparent': 'rgba(255, 255, 255, 0.30)',
        'black-transparent': 'rgba(0, 0, 0, 0.30)',
        'blue-transparent': 'rgba(7, 27, 73, 0.95)',
      },
      textColor: {
        'disabled-text': 'rgba(27, 27, 31, 0.38)',
      },
      textShadow: {
        custom:
          '0 1px 2px rgba(60, 60, 60, 0.6), 0 0 2px rgba(60, 60, 60, 0.3)',
      },
    },
  },
  plugins: [require('tailwindcss-textshadow'), addVariablesForColors],
}

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme('colors'))
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  )

  addBase({
    ':root': newVars,
  })
}
