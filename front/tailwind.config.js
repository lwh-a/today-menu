// Tailwind CSS v4에서는 이 파일이 필요 없습니다.
// 설정은 CSS 파일(@import "tailwindcss")과 vite.config.js로 관리됩니다.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {

        primary: '#F46C6F',

        secondary: '#FFEE7F',

        cream: '#FDFAD1',

        accent: '#FEB95C',

        soft: '#F1B8AE',

      },
    },
  },

  plugins: [],
}