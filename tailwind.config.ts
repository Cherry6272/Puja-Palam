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
        sandalwood: {
          50: "#FAF7F2",
          100: "#F5EFE6",
          200: "#EADECF",
          300: "#D8C3A5",
          400: "#C4A77D",
          500: "#B08B59",
          600: "#8F6E40",
          900: "#45321B",
        },
        brass: {
          50: "#FCF9EC",
          100: "#F7F0D0",
          200: "#EEDCA4",
          300: "#E2C36F",
          400: "#D4AF37",
          500: "#C59B27",
          600: "#A97F1A",
          700: "#866112",
          800: "#694C12",
          900: "#4C360E",
        },
        vermillion: {
          50: "#FDF4F2",
          100: "#FBE6E3",
          200: "#F7CCC6",
          500: "#C83E2D",
          600: "#B33927",
          700: "#8F2617",
          900: "#541209",
        },
        temple: {
          50: "#F5F3F2",
          100: "#E5E1DE",
          200: "#CDC5C0",
          400: "#7F7168",
          600: "#443932",
          700: "#2D241F",
          800: "#1E1714",
          900: "#130E0C",
        },
        tulsi: {
          50: "#F1F7F3",
          100: "#DDECE2",
          500: "#2E6243",
          600: "#255137",
          700: "#1C3E2A",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'brass': '0 4px 20px -2px rgba(197, 155, 39, 0.18)',
        'brass-lg': '0 10px 30px -4px rgba(197, 155, 39, 0.25)',
        'temple': '0 10px 30px -5px rgba(26, 20, 18, 0.08)',
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.03)',
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(135deg, #F7F0D0 0%, #D4AF37 50%, #A97F1A 100%)',
        'brass-gradient': 'linear-gradient(135deg, #E2C36F 0%, #C59B27 50%, #866112 100%)',
        'temple-gradient': 'linear-gradient(180deg, #1E1714 0%, #130E0C 100%)',
        'ivory-gradient': 'linear-gradient(180deg, #FAF7F2 0%, #F5EFE6 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
