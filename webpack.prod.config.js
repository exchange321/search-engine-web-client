const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
  ],
};
