/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#f5f5f5',
            a: {
              color: '#fbbf24',
              '&:hover': {
                color: '#f59e0b',
              },
            },
            strong: {
              color: '#fbbf24',
            },
            code: {
              color: '#fbbf24',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
