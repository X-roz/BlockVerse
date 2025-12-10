/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/app/address-util/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'btn-primary': 'var(--btn-primary)',
        'btn-text': 'var(--btn-text)',
        'icon-color': 'var(--icon-color)',
      },
    },
  },
  plugins: [],
};