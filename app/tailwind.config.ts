/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{html,ts,scss}'];
export const theme = {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      accent: 'var(--color-accent)',
    },
  },
};
export const plugins = [];
