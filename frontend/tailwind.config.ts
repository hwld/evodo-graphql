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
        showScrollbar: "showScrollbar .15s ease-out",
        hideScrollbar: "hideScrollbar .15s ease-out",

        tooltipEnter: "tooltipEnter .15s ease-out",
        tooltipExit: "tooltipExit .15s ease-out",
      },
      keyframes: {
        showScrollbar: { from: { opacity: "0" }, to: { opacity: "1" } },
        hideScrollbar: { from: { opacity: "1" }, to: { opacity: "0" } },

        tooltipEnter: {
          from: { opacity: "0", transform: "translateY(5px)" },
          to: { opacity: "1", transform: "translateY(0px)" },
        },
        tooltipExit: {
          from: { opacity: "1", transform: "translateY(0px)" },
          to: { opacity: "0", transform: "translateY(5px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
