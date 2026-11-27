const webpack = require('webpack')
const { merge } = require('webpack-merge')
const MinimizerPlugin = require("minimizer-webpack-plugin")
const common = require('./webpack.client.common.js')

module.exports = merge(common, {
  mode: 'production',
  // devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new MinimizerPlugin({
        test: /\.js(\?.*)?$/i,
      })
    ]
  },
  output: {
    copy: [
      /**
       * If there are pregenerated sitemap files, copy them
       * into output folder.
       */
      {
        from: 'src/server/sitemap_generator/sitemap_output',
        to: `./sitemap`
      },
      {
        from: 'src/robots.txt',
        to: `.`
      }
    ]
  }
})
