const typefighter = require("./eslint-plugin-typefighter");

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        browser: true,
      },
    },
    plugins: {
      typefighter,
    },
    rules: {
      "typefighter/type-check": "error",
    },
  },
];
