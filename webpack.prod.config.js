const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const baseConfig = require('./webpack.config');

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production'),
};

module.exports = {
  ...baseConfig,
  module: {
    ...baseConfig.module,
    rules: [
      ...baseConfig.module.rules,
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          [
            'css-loader',
          ],
        ),
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          [
            'css-loader',
            'sass-loader',
          ],
        ),
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new ExtractTextPlugin('index.css'),
    new webpack.optimize.UglifyJsPlugin(),
    ...baseConfig.plugins,
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
  ],
};
