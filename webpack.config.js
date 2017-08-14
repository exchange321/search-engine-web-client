const path = require('path');
const colors = require('colors/safe');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

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
    new ProgressBarPlugin({
      format: `  build [${colors.blue.bold(':bar')}] ${colors.green.bold(':percent')} (:elapsed seconds) - :msg`,
    }),
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/index.html`,
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
    new FaviconsWebpackPlugin({
      logo: path.join(__dirname, 'src/images/favicon.png'),
      prefix: 'assets/favicon/',
      emitStats: false,
      persistentCache: true,
      inject: true,
      background: '#fff',
      title: 'AcceSE',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: true,
        favicons: true,
        firefox: true,
        opengraph: true,
        twitter: true,
        yandex: false,
        windows: true,
      },
    }),
    new WebpackPwaManifest({
      fingerprints: false,
      name: 'Accessible Search Engine',
      short_name: 'AcceSE',
      start_url: '.',
      lang: 'en-US',
      orientation: 'any',
      display: 'standalone',
      scope: '/',
      description: 'Accessible Search Engine for People with Intellectual Disabilities',
      background_color: '#e1f0ff',
      theme_color: '#e1f0ff',
      icons: [
        {
          src: path.join(__dirname, 'src/images/favicon.png'),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: path.join('assets', 'favicon'),
        },
      ],
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'src/sw.js'),
    }),
  ],
};
