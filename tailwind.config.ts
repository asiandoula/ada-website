import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";
import tailwindTypography from "@tailwindcss/typography";

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
          // Same #6969C1 everywhere by default (--ada-purple-rgb on :root);
          // the admin scope in globals.css repoints it to the Registry Office ink.
          purple: 'rgb(var(--ada-purple-rgb) / <alpha-value>)',
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
        // Direction C (2026-11 redesign). Values copied from canvas KitC.dc.html.
        // The legacy `ada.*` palette above stays until every page is rewritten.
        ada2: {
          // The two purples. Indigo = certification, blossom = registry. Nothing else is purple.
          indigo: '#3F3F7A',
          'indigo-hover': '#2E2E5E',
          blossom: '#606090',
          'blossom-hover': '#4E4E80',
          // Page neutrals
          ink: '#111827',
          body: '#1F2937',
          muted: '#4B5563',
          hairline: '#D1D5DB',
          band: '#F3F4F6',
          'band-rule': '#E5E7EB', // breadcrumb bottom rule, light-pill hover, text on indigo
          black: '#0B0B0F', // utility bar and footer
          'table-head': '#2B2B33',
          'tag-border': '#6B7280', // page tag outline, tile sublink chevron
          'tag-text': '#374151', // page tag text, "Sample" status cell
          'kit-rule': '#9CA3AF', // footer scope line on black
          'footer-rule': '#3A3A44', // hairline inside the footer
          'util-divider': '#4B4B55', // divider in the utility bar
          // Status (as in A)
          good: '#1D6A45',
          'good-bg': '#DFF0E6',
          'good-text': '#14573A',
          suspended: '#B42318',
          revoked: '#3A1013',
          lapsed: '#6B7785',
          'lapsed-text': '#3F4B57',
          'retired-bg': '#E9EDF2',
          'retired-text': '#33475A',
          // Inside the record sheet only (A's tokens; never restyle the sheet)
          record: {
            ink: '#0C2231',
            muted: '#5A6B7B',
            soft: '#33475A',
            hairline: '#C9D1DA',
            control: '#8595A5',
            panel: '#F5F7F9',
          },
        },
      },
      fontFamily: {
        'dm-serif': ['var(--font-dm-serif)', 'serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
        // Pages: Source Sans 3, CJK falls back to the Noto face for the element's lang
        // (`--font-cjk` is set per :lang() in globals.css).
        site: ['var(--font-source-sans)', 'var(--font-cjk)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        // Records only (VerifyRecord sheet, letter, certificate).
        // CJK falls back to Noto Sans (VerifyRecordZh), never a CJK serif.
        'record-serif': ['var(--font-source-serif)', 'Georgia', 'Times New Roman', 'var(--font-cjk)', 'serif'],
        'record-mono': ['var(--font-plex-mono)', 'ui-monospace', 'Menlo', 'Consolas', 'var(--font-cjk)', 'monospace'],
        // Explicit CJK faces, for language links that must show in their own script.
        'noto-sc': ['var(--font-noto-sc)', 'sans-serif'],
        'noto-tc': ['var(--font-noto-tc)', 'sans-serif'],
        'noto-jp': ['var(--font-noto-jp)', 'sans-serif'],
        'noto-kr': ['var(--font-noto-kr)', 'sans-serif'],
      },
      // The --radius-* overrides are only set inside the admin scope (globals.css);
      // everywhere else the fallbacks keep the previous values exactly.
      borderRadius: {
        xl: "var(--radius-xl, 0.75rem)",
        lg: "var(--radius)",
        md: "var(--radius-md, calc(var(--radius) - 2px))",
        sm: "var(--radius-sm, calc(var(--radius) - 4px))",
      },
    },
  },
  plugins: [tailwindAnimate, tailwindTypography],
};
export default config;
