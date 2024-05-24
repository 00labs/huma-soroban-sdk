module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ['plugin:import/typescript', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.test.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: [
    '.eslintrc.js',
    'config-overrides.js',
    'rollup.config.js',
    'webpack.cosmos.js',
    'babel.config.js',
    'jest.config.js',
    'packages',
    'scripts',
  ],
  rules: {
    'jsx-quotes': 'off',
    semi: 'off',
    '@typescript-eslint/semi': 'off',
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'off',
    'no-param-reassign': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    'no-console': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
    ],
    '@typescript-eslint/no-shadow': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
  },
  overrides: [
    {
      files: ['src/graphql/*.ts'],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['src/packages/**/*.ts'],
      rules: {
        'import/export': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'import/newline-after-import': 'off',
        'spaced-comment': 'off',
        'lines-between-class-members': 'off',
        '@typescript-eslint/lines-between-class-members': 'off',
      },
    },
  ],
}
