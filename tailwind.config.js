/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        border: "rgba(255, 255, 255, 0.1)",
        input: "rgba(255, 255, 255, 0.1)",
        ring: "#FF7A00",
        background: "#0D0907",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#FF7A00",
          50: "#fff5eb",
          100: "#ffe5cc",
          200: "#ffcb99",
          300: "#ffb066",
          400: "#ff9633",
          500: "#FF7A00",
          600: "#cc6200",
          700: "#994900",
          800: "#663100",
          900: "#331800",
          foreground: "#0D0907",
        },
        secondary: {
          DEFAULT: "#2A1F15",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#3A2E22",
          foreground: "rgba(255, 255, 255, 0.6)",
        },
        accent: {
          DEFAULT: "#2A1F15",
          foreground: "#FF7A00",
        },
        popover: {
          DEFAULT: "#1A1410",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#1A1410",
          foreground: "#ffffff",
        },
        warm: {
          orange: "#FF7A00",
          amber: "#FFB347",
        },
        dark: {
          DEFAULT: "#0D0907",
          lighter: "#2A1F15",
          card: "#1A1410",
          muted: "#3A2E22",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 20px rgba(255, 122, 0, 0.3)',
        'glow-lg': '0 0 40px rgba(255, 122, 0, 0.4)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF7A00 0%, #FFB347 50%, #FF9A3C 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FF7A00 0%, #FFB347 50%, #2A1F15 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FF7A00 0%, #FFB347 100%)',
        'gradient-dark': 'linear-gradient(135deg, #2A1F15 0%, #0D0907 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(255, 122, 0, 0.15) 0%, transparent 70%)',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'glass-dark': 'linear-gradient(135deg, rgba(26, 20, 16, 0.8) 0%, rgba(13, 9, 7, 0.9) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-down": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 122, 0, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 122, 0, 0.6)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
