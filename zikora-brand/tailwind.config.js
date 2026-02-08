/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zikora: {
          orange: '#FF6B2C',
          'orange-light': '#FF8F5C',
          'orange-dark': '#E55A1E',
          dark: '#12121A',
          surface: '#1A1A26',
          border: '#2A2A3A',
          'border-hover': '#3A3A4A',
        },
        text: {
          primary: '#F0EDE6',
          secondary: '#A8A4B8',
          muted: '#6B6880',
        },
        success: '#00E676',
        error: '#FF5252',
        warning: '#F0B90B', // BNB yellow
        info: '#00BCD4',
      },
      fontFamily: {
        syne: ['Syne', 'system-ui', 'sans-serif'],
        dm: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'logo': ['48px', { letterSpacing: '0.15em', fontWeight: '800' }],
        'logo-sm': ['32px', { letterSpacing: '0.15em', fontWeight: '800' }],
        'h1': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h2': ['36px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'body': ['16px', { lineHeight: '1.6' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        'caption': ['12px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'label': ['11px', { lineHeight: '1.3', letterSpacing: '0.08em' }],
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'input': '12px',
        'chat': '20px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
        'elevated': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 24px rgba(255, 107, 44, 0.15)',
        'glow-strong': '0 0 40px rgba(255, 107, 44, 0.25)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF6B2C 0%, #FF8F5C 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(255, 107, 44, 0.15) 0%, transparent 70%)',
        'gradient-dark': 'linear-gradient(180deg, #12121A 0%, #0A0A0F 100%)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
      },
      maxWidth: {
        'chat': '480px',
        'content': '1200px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 44, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 107, 44, 0.25)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
