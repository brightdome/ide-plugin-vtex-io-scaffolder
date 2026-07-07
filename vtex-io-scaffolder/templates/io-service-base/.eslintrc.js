module.exports = {
  extends: 'vtex',
  root: true,
  env: { node: true },
  overrides: [
    {
      files: ['node/**/*.ts', 'node/**/*.tsx'],
      parserOptions: {
        project: './node/tsconfig.eslint.json',
        // VS Code's ESLint extension cannot resolve a relative `project`
        // path on its own; `__dirname` makes the lookup absolute so the
        // editor-side parser finds tsconfig the same way `yarn lint` does.
        tsconfigRootDir: __dirname,
      },
    },
  ],
}
