import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './store/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#173F35',
          dark: '#12322A',
          light: '#21574A',
          subtle: '#EDF3F1',
        },
        ink: {
          DEFAULT: '#17231F',
          muted: '#3D4D47',
        },
        green: {
          secondary: '#256B58',
        },
        ivory: {
          DEFAULT: '#F7F5EF',
          paper: '#FCFBF7',
        },
        sage: {
          DEFAULT: '#A7BDAF',
          subtle: '#E4ECE7',
        },
        saffron: {
          DEFAULT: '#E38B32',
          subtle: '#FDF3E7',
        },
        terracotta: {
          DEFAULT: '#B9674B',
          subtle: '#F9EFEB',
        },
        slate: {
          muted: '#58645F',
        },
        warm: {
          border: '#DDE2DC',
          hover: '#F2EFE7',
        },
        brand: {
          50: '#F7F5EF',
          100: '#E4ECE7',
          500: '#256B58',
          600: '#173F35',
          700: '#12322A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        editorial: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
