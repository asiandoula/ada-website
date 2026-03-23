import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        ada: {
          navy: '#0c2231',
          'navy-warm': '#1a3346',
          'navy-dark': '#4a4a70',
          purple: '#6969C1',
          'purple-hover': '#7b7bd4',
          'purple-muted': '#606090',
          cream: '#fdfcfa',
          lavender: '#f8f7fc',
          'off-white': '#f8f8fa',
          'sage': '#f3f9eb',
          'sky': '#eef5fb',
          'rose': '#fdf2f8',
          'peach': '#fef7ed',
          // Framer accent colors
          blue: '#00aeef',
          orange: '#f15a29',
          green: '#8dc63f',
          violet: '#662d91',
          pink: '#ec008c',
          // Accent backgrounds (Light Shade)
          'blue-light': '#e6f7fe',
          'orange-light': '#fdede7',
          'green-light': '#f3f9eb',
          'violet-light': '#f3ebf9',
          'pink-light': '#ffe5f5',
          'yellow-light': '#fffee5',
        },
      },
      fontFamily: {
        'dm-serif': ['var(--font-dm-serif)', 'serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindAnimate],
};
export default config;
