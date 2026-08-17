import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#031636',
        'on-primary': '#ffffff',
        'primary-container': '#1a2b4c',
        secondary: '#735c00',
        'secondary-container': '#fed65b',
        surface: '#fbf8fc',
        'surface-container': '#efedf0',
        'surface-card': '#ffffff',
        'on-surface': '#1b1b1e',
        'on-surface-variant': '#44474e',
        outline: '#75777f',
        'outline-variant': '#c4c6d0',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        success: '#15803d',
        'success-container': '#dcfce7',
        warning: '#b45309',
        'warning-container': '#fef3c7',
        info: '#0284c7',
        'info-container': '#e0f2fe',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(3, 22, 54, 0.06)',
        'card': '0 2px 12px 0 rgba(3, 22, 54, 0.04), 0 0 1px 1px rgba(3, 22, 54, 0.04)',
        'elevated': '0 20px 30px -10px rgba(3, 22, 54, 0.12), 0 8px 10px -6px rgba(3, 22, 54, 0.06)',
      }
    },
  },
  plugins: [],
}
export default config
