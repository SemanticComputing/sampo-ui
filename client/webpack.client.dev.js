const { merge } = require('webpack-merge')
const common = require('./webpack.client.common.js')
const path = require('path')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'build')
      },
      {
        directory: '/app/custom-components',
        publicPath: '/custom-components'
      }
    ],
    hot: true,
    host: '0.0.0.0',
    port: 8080,
    open: true,
    historyApiFallback: true,
    devMiddleware: {
      publicPath: '/'
    }
  }
})
