const path = require('path')

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
  externals: {
    // Use the host app's React, don't bundle a second copy
    react: 'React',
    'react-dom': 'ReactDOM'
  },
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
