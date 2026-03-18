import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ada: {
          purple: '#606090',
          navy: '#0c2231',
          red: '#ed1c24',
          cyan: '#00aeef',
        },
      },
    },
  },
  plugins: [],
};
export default config;
