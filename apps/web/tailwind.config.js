/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'privacy-blue': '#3B82F6',
        'privacy-dark': '#1E293B',
        'privacy-light': '#F8FAFC',
      }
    },
  },
  plugins: [],
}