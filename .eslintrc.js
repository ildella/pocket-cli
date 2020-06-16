module.exports = {
  extends: [
    'node-opinionated',
  ],
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
        'security/detect-child-process': 'off',
      }
    },
  ]
}
