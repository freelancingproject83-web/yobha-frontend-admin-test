/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'helvetica': ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'luxury': {
          'gold': '#d4af37',
          'rose-gold': '#b76e79',
          'cream': '#f8ecc2',
          'warm': '#cfa66b',
          'soft': '#e4b169',
          'light-gold': '#f4e4bc',
          'pale-gold': '#f7edc7',
        },
        'premium': {
          'white': '#ffffff',
          'cream': '#fefcf8',
          'beige': '#f5f2ed',
          'light-beige': '#faf8f5',
          'warm-white': '#fdfbf7',
          'soft-beige': '#f7f4f0',
        },
        'text': {
          'dark': '#2c2c2c',
          'medium': '#4a4a4a',
          'light': '#6b6b6b',
          'rose-gold': '#b76e79',
          'gold': '#d4af37',
        }
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: '0', transform: "translateY(20px)" },
          "100%": { opacity: '1', transform: "translateY(0)" },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 2s ease-out',
        'slide-up': 'slideUp 1.5s ease-out',
        'glow': 'glow 3s ease-in-out infinite alternate',
        fadeIn: "fadeIn 0.4s ease-out forwards",
        slideInLeft: "slideInLeft 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
}