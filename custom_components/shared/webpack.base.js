const path = require('path')

const simpleExternals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-intl-universal': ['__sharedLibraries', 'intl'],
  'tss-react/mui': ['__sharedLibraries', 'tssReactMui'],
  'react-redux': ['__sharedLibraries', 'reactRedux'],
  'react-router-dom': ['__sharedLibraries', 'reactRouterDom'],
  'prop-types': ['__sharedLibraries', 'PropTypes'],
  lodash: ['__sharedLibraries', '_'],
  qs: ['__sharedLibraries', 'qs'],
  history: ['__sharedLibraries', 'history'],
  '@sampo-ui/components': ['__sharedLibraries', 'components'],
  '@sampo-ui/helpers': ['__sharedLibraries', 'helpers'],
  '@sampo-ui/configsStore': ['__sharedLibraries', 'configsStore']
}

module.exports = (componentName) => ({
  entry: path.resolve(__dirname, `../components/${componentName}/src/index.jsx`),
  output: {
    filename: `${componentName}.js`,
    path: path.resolve(__dirname, '../dist'),
    library: {
      type: 'window',
      name: ['__customComponents', componentName]
    }
  },
  externals: [
    function ({ request }, callback) {
      if (simpleExternals[request]) {
        return callback(null, simpleExternals[request])
      }
      // @mui/material/Box → window.__sharedLibraries.MUI.Box
      if (request.startsWith('@mui/material/')) {
        const component = request.replace('@mui/material/', '')
        return callback(null, ['__sharedLibraries', 'MUI', component])
      }
      // @mui/icons-material/ExpandMore → window.__sharedLibraries.MuiIcons.ExpandMore
      if (request.startsWith('@mui/icons-material/')) {
        const icon = request.replace('@mui/icons-material/', '')
        return callback(null, ['__sharedLibraries', 'MuiIcons', icon])
      }
      // @mui/material (barrel) → window.__sharedLibraries.MUI
      if (request === '@mui/material') {
        return callback(null, ['__sharedLibraries', 'MUI'])
      }
      if (request === '@mui/icons-material') {
        return callback(null, ['__sharedLibraries', 'MuiIcons'])
      }
      callback()
    }
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-react'] }
      }
    }]
  }
})
