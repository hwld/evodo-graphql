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
        dialogEnter: "dialogEnter .15s ease-out",
        dialogExit: "dialogExit .15s ease-out",
        dialogOverlayEnter: "dialogOverlayEnter .15s ease-out",
        dialogOverlayExit: "dialogOverlayExit .15s ease-out",
      },
      keyframes: {
        popoverEnter: {
          from: { opacity: "0", transform: "scale(.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        popoverExit: {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(.9)" },
        },
        dialogOverlayEnter: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        dialogOverlayExit: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        dialogEnter: {
          from: { opacity: "0", transform: "translate(-50%, -60%)" },
          to: { opacity: "1", transform: "translate(-50%, -50%)" },
        },
        dialogExit: {
          from: { opacity: "1", transform: "translate(-50%, -50%,)" },
          to: { opacity: "0", transform: "translate(-50%, -60%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
