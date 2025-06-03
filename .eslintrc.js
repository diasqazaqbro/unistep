module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@typescript-eslint", "no-cyrillic-string"],
  extends: [
    "eslint:recommended",
    "next",
    "next/core-web-vitals",
  ],
  rules: {
    "no-cyrillic-string/no-cyrillic-string": "error",
  },
};
