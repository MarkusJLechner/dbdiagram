module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/prettier',
    'plugin:prettier/recommended',
    'plugin:vue/base',
  ],
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly"
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 12,
    requireConfigFile: false,
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'prettier/prettier': ['error'],
    'vue/no-multiple-template-root': 'off',
    'vue/script-setup-uses-vars': 'error',
    'vue/no-v-model-argument': 'off'
  },
}
