module.exports = {
  extends: [
    'node-opinionated',
    'plugin:jest/recommended'
  ],
  plugins: ['jest'],
  overrides: [
    {
      files: ['**/*test*/**'],
      rules: {
        'node/no-unpublished-require': 'off',
        'node/no-unpublished-import': 'off',
        'max-nested-callbacks': ['warn', 3],
        'max-lines': ['warn', 200],
        'sonarjs/no-duplicate-string': 'off',
        'no-console': 'off',
        'no-sync': 'off',
        'no-undefined': 'off',
        'security/detect-child-process': 'off',
        'security/detect-non-literal-fs-filename': 'off',
        'security/detect-non-literal-require': 'off'
      }
    },
    {
      files: ['**/*src*/**'],
      rules: {
        'no-console': 'off',
        'no-process-exit': 'off',
        'no-sync': 'off', // TBRemoved as we're not on Node12
        'sonarjs/no-unused-collection': 'off',
        'security/detect-child-process': 'off',
      }
    },
    {
      files: ['**/**'],
      rules: {
        'camelcase': 'off',
      }
    },
  ]
}
