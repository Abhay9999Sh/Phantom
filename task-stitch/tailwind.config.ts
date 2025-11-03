import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#111111',
        content: '#1C1C1C',
        primary: '#9F54FF',
        'text-main': '#FFFFFF',
        'text-secondary': '#A0A0A0',
      },
      ringColor: {
        primary: '#9F54FF',
      },
      ringOpacity: {
        'primary-focus': '0.3',
      },
    },
  },
  plugins: [],
}

export default config