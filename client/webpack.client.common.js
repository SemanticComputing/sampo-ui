const path = require('path')
require('dotenv').config()
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

const outputDirectory = 'dist/public'
const apiUrl = typeof process.env.API_URL !== 'undefined' ? process.env.API_URL : 'http://localhost:3001/api/v1'

module.exports = {
  entry: {
    app: './src/index.js'
  },
  plugins: [
    /**
     * All files inside webpack's output.path directory will be removed once, but the
     * directory itself will not be. If using webpack 4+'s default configuration,
     * everything under <PROJECT_DIR>/dist/ will be removed.
     * Use cleanOnceBeforeBuildPatterns to override this behavior.
     *
     * During rebuilds, all webpack assets that are not used anymore
     * will be removed automatically.
    */
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // Load a custom template
      template: 'src/index.html',
      favicon: 'src/favicon.ico'
    }),
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(apiUrl)
    })
  ],
  output: {
    filename: '[name].[fullhash].js',
    path: path.resolve(__dirname, outputDirectory),
    publicPath: '/'
  },
  module: {
    parser: {
      "css/auto": {
        exportType: "style"
      }
    },
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.s?css$/,
        use: ['sass-loader'],
        type: "css/auto"
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
      {
        test: /\.(woff2|woff|eot|ttf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        }
      },
      // Add rule for disabling dynamic URL parsing for maplibre-gl (see issue https://github.com/maplibre/maplibre-gl-js/issues/8060)
      {
        test: /[\\/]maplibre-gl[\\/]dist[\\/]maplibre-gl\.mjs$/,
        parser: {
          dynamicUrl: false
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules',
      path.resolve(__dirname, 'custom'),
      path.resolve(__dirname, 'src')
    ]
  },
  experiments: {
    css: true,
    topLevelAwait: true
  }
}
