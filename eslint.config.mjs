import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import stylistic from "@stylistic/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      // Build outputs
      ".next/**/*",
      ".nuxt/**/*",
      "dist/**/*",
      "build/**/*",
      "out/**/*",

      // Dependencies
      "node_modules/**/*",

      // Environment files
      ".env",
      ".env.local",
      ".env.production",
      ".env.staging",

      // Generated files
      "*.tsbuildinfo",
      "next-env.d.ts",

      // Generated Next.js types and webpack files
      "**/static/**/*",
      "**/_buildManifest.js",
      "**/_ssgManifest.js",
      "**/webpack.js",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      // Indentation and spacing
      "@stylistic/indent": ["error", 2],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/jsx-quotes": ["error", "prefer-single"],
      "@stylistic/quotes": [
        "error",
        "double",
        { allowTemplateLiterals: "always" },
      ],
      "@stylistic/comma-dangle": [
        "error",
        {
          functions: "never",
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "always-multiline",
          exports: "always-multiline",
        },
      ],

      // Object and array formatting
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/array-bracket-spacing": ["error", "never"],
      "@stylistic/comma-spacing": ["error", { before: false, after: true }],

      // Function and arrow function formatting
      "@stylistic/arrow-spacing": ["error", { before: true, after: true }],
      "@stylistic/space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],

      // Line breaks and spacing
      "@stylistic/eol-last": ["error", "always"],
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/max-len": [
        "error",
        {
          code: 120,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: true,
        },
      ],

      // JSX specific rules
      "@stylistic/jsx-quotes": ["error", "prefer-double"],
      "@stylistic/jsx-tag-spacing": [
        "error",
        {
          closingSlash: "never",
          beforeSelfClosing: "always",
          afterOpening: "never",
          beforeClosing: "never",
        },
      ],
      "@stylistic/jsx-curly-spacing": ["error", { when: "never" }],
      "@stylistic/jsx-equals-spacing": ["error", "never"],

      // TypeScript specific
      "@stylistic/type-annotation-spacing": "error",
      "@stylistic/member-delimiter-style": [
        "error",
        {
          multiline: {
            delimiter: "semi",
            requireLast: true,
          },
          singleline: {
            delimiter: "semi",
            requireLast: false,
          },
        },
      ],
    },
  },
];

export default eslintConfig;
