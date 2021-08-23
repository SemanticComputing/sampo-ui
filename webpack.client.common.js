const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

const outputDirectory = 'dist/public'
const apiUrl = typeof process.env.API_URL !== 'undefined' ? process.env.API_URL : 'http://localhost:3001/api/v1'

module.exports = {
  entry: {
    app: './src/client/index.js'
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
      template: 'src/client/index.html',
      favicon: 'src/client/favicon.ico'
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
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.s?css$/,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'images'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
}
