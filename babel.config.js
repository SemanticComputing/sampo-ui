module.exports = function (api) {
  api.cache(true)
  const presets = []
  const plugins = []
  if (process.env.BABEL_ENV === 'browser') {
    presets.push([
      // https://babeljs.io/docs/en/babel-preset-env
      '@babel/preset-env',
      {
        /**
         * Target Browserslist’s default browsers.
         * https://github.com/browserslist/browserslist
         */
        targets: 'defaults',
        useBuiltIns: 'usage',
        corejs: { version: 3, proposals: true }
      }
    ])
    presets.push('@babel/preset-react')
    plugins.push('@babel/plugin-transform-runtime')
  }
  if (process.env.BABEL_ENV === 'node') {
    presets.push([
      '@babel/preset-env',
      {
        targets: {
          node: '14'
        }
      }
    ])
  }
  // for JavaScript Standard Style library to support JSX syntax
  if (process.env.BABEL_ENV === undefined) {
    presets.push('@babel/preset-react')
  }

  return {
    presets,
    plugins
  }
}
