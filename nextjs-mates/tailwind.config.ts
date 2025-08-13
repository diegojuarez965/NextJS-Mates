import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        greenMate: '#99B898',
        greenMateButton: '#3F5E4B',
        greenMateTransparent: '#99B898CC',
        greenMateNeon: '#5C9933',
        carbon:   '#2A363B'
        
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
