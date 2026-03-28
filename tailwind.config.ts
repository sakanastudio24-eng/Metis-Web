import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        metis: {
          red: "hsl(var(--metis-red))",
          cream: "hsl(var(--metis-cream))",
          ink: "hsl(var(--metis-ink))",
          panel: "hsl(var(--metis-panel))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['"Inter"', "sans-serif"],
        serif: ['"DM Serif Display"', "serif"],
        display: ['"Jua"', "sans-serif"],
      },
      boxShadow: {
        glow: "0 20px 65px rgba(220, 94, 94, 0.18)",
        panel: "0 28px 90px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        "metis-auth":
          "radial-gradient(circle at top left, rgba(220, 94, 94, 0.22), transparent 38%), linear-gradient(180deg, #131d2a 0%, #0b1119 100%)",
        "metis-onboarding":
          "radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 42%), linear-gradient(180deg, #d85d5d 0%, #bf4444 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
