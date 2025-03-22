
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
        slot: {
          background: "#1A1F2C",
          symbol: "rgba(0, 0, 0, 0.6)",
          "neon-purple": "#9b87f5",
          "neon-green": "#10B981",
        },
        fantasy: {
          "primary": "#9b87f5",
          "secondary": "#7E69AB",
          "tertiary": "#6E59A5",
          "dark": "#1A1F2C",
          "light": "#D6BCFA",
          "stone": "#8E9196",
          "earth": "#3a6e32",
          "wood": "#8A898C",
          "metal": "#C8C8C9",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "spin-slot": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-500px)" },
        },
        "slot-win": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        "neon-pulse": {
          "0%": { boxShadow: "0 0 5px 0 rgba(139, 92, 246, 0.5)" },
          "50%": { boxShadow: "0 0 20px 5px rgba(139, 92, 246, 0.8)" },
          "100%": { boxShadow: "0 0 5px 0 rgba(139, 92, 246, 0.5)" },
        },
        "float": {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
          "100%": { transform: "translateY(0)" },
        },
        "magical-glow": {
          "0%": { filter: "drop-shadow(0 0 2px #9b87f5)" },
          "50%": { filter: "drop-shadow(0 0 10px #9b87f5)" },
          "100%": { filter: "drop-shadow(0 0 2px #9b87f5)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slot": "spin-slot 0.5s linear infinite",
        "slot-win": "slot-win 0.5s ease-in-out 3",
        "neon-pulse": "neon-pulse 2s infinite",
        "float": "float 3s ease-in-out infinite",
        "magical-glow": "magical-glow 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
