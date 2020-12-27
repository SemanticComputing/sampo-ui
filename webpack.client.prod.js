const webpack = require('webpack')
const { merge } = require('webpack-merge')
const CopyPlugin = require('copy-webpack-plugin')
const common = require('./webpack.client.common.js')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CopyPlugin({
      patterns: [
        /**
         * If there are pregenerated sitemap files, copy them
         * into output folder.
         */
        {
          from: 'src/server/sitemap_generator/sitemap',
          to: `${common.output.path}/sitemap`,
          noErrorOnMissing: true
        }
      ]
    })
  ]
})
