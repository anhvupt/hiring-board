/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'var(--primary-light)',
          DEFAULT: 'var(--primary-default)',
          dark: 'var(--primary-dark)'
        },
        accent: {
          light: 'var(--accent-light)',
          DEFAULT: 'var(--accent-default)',
          dark: 'var(--accent-dark)'
        }
      }
    }
  },
  plugins: []
};
