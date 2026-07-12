import js from '@eslint/js';
import importX from 'eslint-plugin-import-x';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const serverFiles = [
  'apps/api/**/*.{js,mjs,cjs,ts,tsx}',
  'apps/workers/**/*.{js,mjs,cjs,ts,tsx}',
  'packages/{domain,transaction-builder,txline-adapter}/**/*.{js,mjs,cjs,ts,tsx}',
];

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/build/**',
      '**/coverage/**',
      '**/dist/**',
      '**/artifacts/**',
      '**/playwright-report/**',
      '**/test-results/**',
      'video/playwright-demo.spec.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  importX.flatConfigs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: { ...globals.node } },
    rules: {
      'import-x/no-duplicates': 'error',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-unresolved': 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'import-x/no-unresolved': 'off',
      'no-undef': 'off',
    },
  },
  {
    files: serverFiles,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@datafinops/wallet-client', '@datafinops/wallet-client/*'],
              message: 'Wallet adapters are browser-only and cannot enter server packages.',
            },
          ],
        },
      ],
    },
  },
];
