const merge = require('webpack-merge');
const common = require('./webpack.client.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    hot: true,
    port: 8080,
    open: true,
    historyApiFallback: true,
    publicPath: '/',
    contentBase: path.join(__dirname, 'dist/public')
  }
});
