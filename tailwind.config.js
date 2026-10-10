/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#080808',
        surface: '#111111',
        'surface-elevated': '#191919',
        'surface-highlight': '#202020',
        primary: '#1D9E75',
        'primary-light': '#24c490',
        'primary-dark': '#15784f',
        purple: '#a78bfa',
        coral: '#ff6b6b',
        amber: '#fbbf24',
        'text-primary': '#f5f5f5',
        'text-secondary': '#a3a3a3',
        'text-muted': '#737373',
        border: 'rgba(255,255,255,0.07)',
        'border-bright': 'rgba(255,255,255,0.15)',
        instagram: '#E1306C',
        youtube: '#FF0000',
        tiktok: '#69C9D0',
        twitter: '#1DA1F2',
        linkedin: '#0A66C2',
      },
      fontFamily: {
        syne: ['Syne_700Bold'],
        'dm-sans': ['DMSans_400Regular'],
      },
      borderRadius: {
        xs: '6px',
        sm: '10px',
        md: '14px',
        lg: '20px',
        xl: '28px',
      },
    },
  },
  plugins: [],
}
