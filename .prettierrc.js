/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["cx"],
  tabWidth: 2,
  semi: true,
};

module.exports = config;
