// Reference: https://github.com/christianalfoni/webpack-express-boilerplate/blob/master/webpack.production.config.js

import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StatsPlugin from 'stats-webpack-plugin';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import autoprefixer from 'autoprefixer';
import WebpackShellPlugin from 'webpack-shell-plugin';

import Config from './config';

const plugins = Config.IS_DEVELOPMENT ? [
  new webpack.optimize.OccurenceOrderPlugin(),
  new HtmlWebpackPlugin({
    template: 'src/index.html',
    inject: true,
    filename: 'index.html',
    showErrors: true,
  }),
  new webpack.HotModuleReplacementPlugin(),
  new BrowserSyncPlugin({ // BrowserSync options
    // Browse to http://localhost:3000 during dev
    host: 'localhost',
    port: 3000,
    open: true, // Open a tab in browser
    browser: ['google chrome'],
    // Webpack dev server url
    proxy: Config.SERVER_URL,
  }, { // plugin options
    reload: false,
  }),
  new webpack.NoErrorsPlugin(),
] : [
  new webpack.optimize.OccurenceOrderPlugin(),
  new HtmlWebpackPlugin({
    template: 'src/index.html',
    inject: true,
    filename: 'index.html',
  }),
  new ExtractTextPlugin('[name]-[hash].min.css'),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compressor: {
      warnings: false,
      screw_ie8: true,
    },
  }),
  new StatsPlugin('webpack.stats.json'),
  new WebpackShellPlugin({
    onBuildStart: ['echo "\n\n-----"', 'echo "Webpack Start"', 'echo "-----\n"'],
    onBuildEnd: ['echo "\n\n-----"', 'echo "Webpack End"', 'echo "-----\n"'],
  }),
  new webpack.NoErrorsPlugin(),
];

const babelPresets = Config.IS_DEVELOPMENT ? ['react', 'es2015', 'react-hmre'] : ['react', 'es2015'];

const cssLoader = Config.IS_DEVELOPMENT ? {
  test: /\.css?$/,
  loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]',
} : {
  test: /\.css?$/,
  loader: ExtractTextPlugin.extract('style', 'css?modules&localIdentName=[name]---[local]---[hash:base64:5]!postcss'),
};


module.exports = {
  devtool: 'source-map',
  // devtool: Config.IS_DEVELOPMENT ? 'eval-source-map' : null,
  entry: {
    // [name]: [sources] -> file.html output uses the same name. js/css files use [name] and will auto-append to file.html
    index: ['./src/index', 'webpack-hot-middleware/client'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-[hash].js',
    sourceMapFilename: '[file].map',
    // publicPath: '/static/',
  },
  plugins,
  module: {
    loaders: [
      { // Bable
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: babelPresets,
        },
      }, { // Json
        test: /\.json?$/,
        loader: 'json',
      },
      cssLoader,
      { // Image: inline base64 URLs for <=8k images, direct URLs for the rest
        test: /\.(gif|jpe?g|png|svg)$/,
        loader: 'url-loader?limit=8192&name=[name]-[hash].[ext]',
      },
    ],
  },
  postcss: [
    autoprefixer,
  ],
};
