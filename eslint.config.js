import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-console': ['error', { allow: ['error', 'info', 'warn'] }],
      'no-debugger': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/shared/components/**'],
              message:
                'Use "@shared/components" instead of relative paths to shared components.',
            },
            {
              group: ['@shared/components/**'],
              message:
                'Use "@shared/components" (barrel) instead of direct paths to individual components.',
            },
          ],
        },
      ],
    },
  },
  prettier,
])
