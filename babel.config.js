module.exports = function (api) {
  api.cache(true)
  const isBrowser = process.env.BABEL_ENV === 'browser'
  const presets = []
  const plugins = []
  if (isBrowser) {
    presets.push([
      '@babel/preset-env',
      {
        /**
         * Target Browserslist’s default browsers.
         * https://github.com/browserslist/browserslist
         */
        targets: 'defaults'
      }
    ])
    presets.push('@babel/preset-react')
    plugins.push('@babel/plugin-proposal-class-properties')
    plugins.push('@babel/plugin-transform-runtime')
  }
  if (!isBrowser) {
    presets.push([
      '@babel/preset-env',
      {
        targets: {
          node: '14'
        }
      }
    ])
  }

  return {
    presets,
    plugins
  }
}
