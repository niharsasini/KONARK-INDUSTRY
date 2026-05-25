/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'k-bg': '#0a0f1e',
        'k-surface': '#111827',
        'k-card': '#0f172a',
        'k-border': '#1e2d40',
        'k-accent': '#00d4ff',
        'k-purple': '#7c3aed',
        'k-orange': '#f97316',
        'k-text': '#f1f5f9',
        'k-muted': '#94a3b8',
        'k-success': '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
