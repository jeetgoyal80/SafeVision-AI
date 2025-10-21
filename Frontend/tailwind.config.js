/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        ...colors, // ✅ includes all default Tailwind colors like cyan, emerald, etc.
        border: "hsl(var(--border, 0 0% 50%))",
        background: "hsl(var(--background, 222 47% 11%))",
        foreground: "hsl(var(--foreground, 210 40% 98%))",
      },
    },
  },
  safelist: [
    { pattern: /bg-(background|foreground)/, variants: ['dark'] },
    'bg-background',
    'text-foreground',
    { pattern: /text-cyan-(100|200|300|400|500|600|700|800|900)/ }, 
    // ✅ ensure cyan text utilities aren’t purged
  ],
  plugins: [require("tailwindcss-animate")],
};
