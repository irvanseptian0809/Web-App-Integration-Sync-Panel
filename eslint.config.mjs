import js from "@eslint/js"
import next from "eslint-config-next"
import prettier from "eslint-config-prettier"
import globals from "globals"

import unusedImports from "eslint-plugin-unused-imports"

export default [
  js.configs.recommended,
  ...next,
  prettier,

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      "unused-imports": unusedImports,
    },

    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "react/no-unescaped-entities": "off",
      "import/no-anonymous-default-export": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/set-state-in-effect": "off",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
]
