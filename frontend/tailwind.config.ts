import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        popoverEnter: "popoverEnter .15s ease-out",
        popoverExit: "popoverExit .15s ease-out",
        checked: "checked .15s ease-out",
        unchecked: "unchecked .15s ease-out",
      },
      keyframes: {
        popoverEnter: {
          "0%": { opacity: "0", transform: "scale(.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        popoverExit: {
          "0%": { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(.9)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
