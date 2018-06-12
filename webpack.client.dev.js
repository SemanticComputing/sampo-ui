const merge = require('webpack-merge');
const common = require('./webpack.client.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    port: 8080,
    open: true,
    // proxy: {
    //   '/api': 'http://localhost:3000'
    // }
  }
});
