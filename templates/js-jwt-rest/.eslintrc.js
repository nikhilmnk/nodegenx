export default {
  env: {
    browser: false,
    es2021: true,
    node: true
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  rules: {}
};
