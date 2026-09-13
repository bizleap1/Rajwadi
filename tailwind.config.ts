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
        "royal-ivory": {
          DEFAULT: "#F8F1E7",
          light: "#FDFAF5",
          dark: "#EFE6D8",
          subtle: "#F8F1E7F0",
        },
        "heritage-maroon": {
          DEFAULT: "#5A1F2B",
          dark: "#3D141C",
          deep: "#2B0B12",
          light: "#762D3C",
          subtle: "rgba(90, 31, 43, 0.08)",
        },
        "antique-gold": {
          DEFAULT: "#C6A15B",
          light: "#D8BA7A",
          dark: "#9E7B35",
          subtle: "rgba(198, 161, 91, 0.15)",
        },
        charcoal: {
          DEFAULT: "#171717",
          light: "#262626",
          dark: "#0F0F0F",
          muted: "#525252",
        },
        "soft-beige": {
          DEFAULT: "#E8D8C4",
          light: "#F5ECE1",
          dark: "#D6BF9F",
          subtle: "rgba(232, 216, 196, 0.4)",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      letterSpacing: {
        widest: ".25em",
        regal: ".18em",
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(135deg, #C6A15B 0%, #E8D8C4 50%, #C6A15B 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
