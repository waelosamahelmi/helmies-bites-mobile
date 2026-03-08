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
        primary: {
          DEFAULT: "#FF7A00",
          50: "#FFF5EB",
          100: "#FFE5CC",
          200: "#FFCB99",
          300: "#FFB066",
          400: "#FF9633",
          500: "#FF7A00",
          600: "#CC6200",
          700: "#994900",
          800: "#663100",
          900: "#331800",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F8F8F8",
          tertiary: "#F0F0F0",
          dark: "#202125",
        },
        text: {
          primary: "#202125",
          secondary: "#6B6B6B",
          tertiary: "#9B9B9B",
          inverse: "#FFFFFF",
        },
        border: {
          DEFAULT: "#EEEEEE",
          strong: "#DDDDDD",
        },
        success: "#00B67A",
        warning: "#FFB800",
        error: "#E63946",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.12)',
        'bottom-nav': '0 -1px 8px rgba(0,0,0,0.08)',
        'sheet': '0 -4px 24px rgba(0,0,0,0.12)',
        'float': '0 4px 12px rgba(0,0,0,0.15)',
        'glow': '0 0 20px rgba(255, 122, 0, 0.3)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
