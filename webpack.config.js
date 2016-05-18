// Reference: https://github.com/christianalfoni/webpack-express-boilerplate/blob/master/webpack.production.config.js
// @flow
'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

var Config =  require('./config');

var plugins = Config.IS_DEVELOPMENT ? [
  new webpack.optimize.OccurenceOrderPlugin(),
  new HtmlWebpackPlugin({
    template: 'app/index.html',
    inject: true,
    filename: 'index.html',
  }),
  new webpack.HotModuleReplacementPlugin(),
  new BrowserSyncPlugin({ // BrowserSync options
    // Browse to http://localhost:3000 during dev
    host: 'localhost',
    port: 3000,
    open: true,
    // Webpack dev server url
    proxy: Config.SERVER_URL,
  }, { // plugin options
    reload: false,
  }),
  new webpack.NoErrorsPlugin(),
] : [
  new webpack.optimize.OccurenceOrderPlugin(),
  new HtmlWebpackPlugin({
    template: 'app/index.html',
    inject: true,
    filename: 'index.html',
  }),
  new ExtractTextPlugin('[name]-[hash].min.css'),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false,
      screw_ie8: true,
    },
  }),
  new StatsPlugin('webpack.stats.json'),
  new webpack.NoErrorsPlugin(),
];

var babelPresets = Config.IS_DEVELOPMENT ? ['react', 'es2015', 'react-hmre'] : ['react', 'es2015'];

var cssLoader = Config.IS_DEVELOPMENT ? {
  test: /\.css?$/,
  loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]',
} : {
  test: /\.css?$/,
  loader: ExtractTextPlugin.extract('style', 'css?modules&localIdentName=[name]---[local]---[hash:base64:5]!postcss'),
};


module.exports = {
  devtool: Config.IS_DEVELOPMENT ? 'eval-source-map' : null,
  entry: [
    'webpack-hot-middleware/client',
    './app/index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-[hash].js',
    publicPath: '/static/',
  },
  plugins,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          'presets': babelPresets,
        },
      }, {
        test: /\.json?$/,
        loader: 'json',
      },
      cssLoader,
    ],
  },
  postcss: [
    require('autoprefixer'),
  ],
};






// module.exports = {
//   context: __dirname,
//   devtool: Config.IS_DEVELOPMENT ? 'inline-sourcemap' : null,
//   entry: './app/main.js',
//   output: {
//     path: __dirname + '/js',
//     filename: 'main.min.js'
//   },
//   plugins: Config.IS_DEVELOPMENT ? [] : [
//     new webpack.optimize.DedupePlugin(),
//     new webpack.optimize.OccurenceOrderPlugin(),
//     new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
//   ],
// };
