// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  { ignores: ["dist/**", "coverage/**", "storybook-static/**", ".angular/**"] },
  {
    files: ["**/*.ts"],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": ["error", { type: "attribute", prefix: "ui", style: "camelCase" }],
      // Components use either an element (ui-tag) or an element-scoped attribute (button[uiButton]); enforce the prefix, not a single style.
      "@angular-eslint/component-selector": ["error", { prefix: "ui" }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // Library convention: short exported names (UiButton), like Angular Material's MatButton.
      "@angular-eslint/component-class-suffix": "off",
      "@angular-eslint/directive-class-suffix": "off",
    },
  },
  {
    files: ["**/*.html"],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
);
