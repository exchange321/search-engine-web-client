const path = require('path');
const NyanProgressPlugin = require('nyan-progress-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

module.exports = {
  entry: [
    `${__dirname}/src/index.js`,
  ],
  target: 'web',
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2)$/,
        use: [
          {
            loader: 'url-loader?&limit=5000',
            options: {
              limit: 5000,
              name: 'assets/fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream',
              name: 'assets/fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
            options: {
              limit: 10000,
              mimetype: 'image/svg+xml',
              name: 'assets/fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/images/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new NyanProgressPlugin(),
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/index.html`,
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'src/sw.js'),
    }),
  ],
};
