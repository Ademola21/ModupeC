import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-primary': '#0D0C0F',
        'background-secondary': '#1C1C1E',
        'background-tertiary': '#2C2C2D',
        'text-primary': '#F5F5F7',
        'text-secondary': '#E5E5E7',
        'text-tertiary': '#AEAEB2',
        'text-muted': '#8E8E93',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'fade-in-slow': 'fadeIn 1s ease-out forwards',
        'progress-bar': 'progressBar 5s linear forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        progressBar: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
