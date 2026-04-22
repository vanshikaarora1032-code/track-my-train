/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a1208',
        'bg-card': '#111a0f',
        'bg-input': '#182216',
        'accent': '#c8f135',
        'text-primary': '#ffffff',
        'text-muted': '#6b7280',
        'border-custom': '#243324',
      },
      borderRadius: {
        'input': '10px',
        'button': '50px',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'dots': "radial-gradient(circle, #243324 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}
