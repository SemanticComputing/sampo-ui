const merge = require('webpack-merge');
const common = require('./webpack.client.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    port: 8080,
    open: true,
  }
});
