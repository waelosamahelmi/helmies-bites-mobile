/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand colors (Mesio-inspired green)
        primary: {
          DEFAULT: "#1DBF73",
          50: "#E8F9F1",
          100: "#D0F3E3",
          200: "#A1E7C7",
          300: "#72DBAB",
          400: "#43CF8F",
          500: "#1DBF73",
          600: "#17995C",
          700: "#117345",
          800: "#0B4D2E",
          900: "#062617",
        },
        // Accent colors
        accent: {
          orange: "#FFC700",
          red: "#FE2121",
          coral: "#FE724E",
        },
        // Surface colors
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F8F8F8",
          tertiary: "#F1F1F1",
          dark: "#262B2E",
        },
        // Text colors
        text: {
          primary: "#262B2E",
          secondary: "#8A8D9F",
          tertiary: "#9B9B9B",
          inverse: "#FFFFFF",
        },
        // Border colors
        border: {
          DEFAULT: "#EEEEEE",
          strong: "#E0E0E0",
          focus: "#1DBF73",
        },
        // Status colors
        success: "#1DBF73",
        warning: "#FFC700",
        error: "#FE2121",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'xxs': ['10px', '14px'],
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '28px'],
        'xl': ['20px', '28px'],
        '2xl': ['22px', '30px'],
        '3xl': ['24px', '32px'],
      },
      borderRadius: {
        'DEFAULT': '10px',
        'sm': '5px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 0 25px rgba(211, 209, 216, 0.25)',
        'card-hover': '0 4px 30px rgba(211, 209, 216, 0.35)',
        'bottom-nav': '0 -1px 8px rgba(0, 0, 0, 0.08)',
        'sheet': '0 -4px 24px rgba(0, 0, 0, 0.12)',
        'float': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 20px rgba(29, 191, 115, 0.3)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        'header': '48px',
        'tabbar': '60px',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
