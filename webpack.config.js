// @flow
'use strict';

var path = require('path');
var webpack = require('webpack');

// import Config from './config';

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './app/index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname,
      },
      {
        test: /\.css?$/,
        loaders: [ 'style', 'raw' ],
        include: __dirname,
      },
    ],
  },
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
