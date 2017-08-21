// Reference: https://github.com/christianalfoni/webpack-express-boilerplate/blob/master/webpack.production.config.js

import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import WebpackShellPlugin from 'webpack-shell-plugin';

import Config from './config';

const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;

// [name]: [sources] -> file.html output uses the same name. js/css files use [name] and will auto-append to file.html
const entry = Config.IS_DEVELOPMENT ? {
  index: ['babel-polyfill', './src/index', 'webpack-hot-middleware/client'],
} : {
  index: ['babel-polyfill', './src/index'],
};

const plugins = Config.IS_DEVELOPMENT ? [
  new HtmlWebpackPlugin({
    template: 'src/index.html',
    inject: true,
    filename: 'index.html',
    showErrors: true,
  }),
  new ExtractTextPlugin('[name]-[hash].min.css'),
  new webpack.HotModuleReplacementPlugin(),
  new BrowserSyncPlugin({ // BrowserSync options
    // Browse to http://localhost:3000 during dev
    host: 'localhost',
    port: 3000,
    // open: true, // Open a tab in browser
    open: false, // Don't open
    browser: ['google chrome'],
    // Webpack dev server url
    proxy: Config.SERVER_URL,
  }, { // plugin options
    reload: false,
  }),
  new WebpackShellPlugin({
    onBuildStart: ['echo "-----"', 'echo "Webpack Start"', 'echo "-----"'],
    onBuildEnd: [
      'echo "-----"',
      // 'make jasmine',
      'echo "Webpack End"',
      'echo "-----"',
    ],
  }),
  new webpack.NoEmitOnErrorsPlugin(),
] : [
  new HtmlWebpackPlugin({
    template: 'src/index.html',
    inject: true,
    filename: 'index.html',
  }),
  new ExtractTextPlugin('[name]-[hash].min.css'),
  // Disable React compressed production version warnings for UglifyJsPlugin with DefinePlugin
  // https://github.com/facebook/react/issues/6479#issuecomment-214590100
  // http://dev.topheman.com/make-your-react-production-minified-version-with-webpack/
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
  new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    sourceMap: true,
    compressor: {
      warnings: false,
      // screw_ie8: true,
    },
    output: {
      comments: false,
    },
  }),
  new StatsWriterPlugin({
    filename: 'webpack.stats.json',
  }),
  new WebpackShellPlugin({
    onBuildStart: ['echo "\n\n-----"', 'echo "Webpack Start"', 'echo "-----\n"'],
    onBuildEnd: ['echo "\n\n-----"', 'echo "Webpack End"', 'echo "-----\n"'],
  }),
  new webpack.NoEmitOnErrorsPlugin(),
];

let babelPresets = ['react', 'es2015', 'stage-2'];
babelPresets = Config.IS_DEVELOPMENT ? [...babelPresets, 'react-hmre'] : babelPresets;

// Prefer react-css-modules over css-loader
// Source: https://github.com/gajus/react-css-modules#usage
const cssLoader = Config.IS_DEVELOPMENT ? {
  test: /\.css$/,
  include: path.join(__dirname, 'src'),
  loaders: [
    'style-loader',
    'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[path][name]__[local]__[hash:base64:5]',
    'postcss-loader?sourceMap=inline',
  ],
} : {
  test: /\.css$/,
  include: path.join(__dirname, 'src'),
  loader: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: 'css-loader?modules&importLoaders=1&localIdentName=[path][name]__[local]__[hash:base64:5]!postcss-loader',
  }),
};

module.exports = {
  devtool: Config.IS_DEVELOPMENT ? 'eval-source-map' : 'source-map',
  entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-[hash].js',
    sourceMapFilename: '[file].map',
    publicPath: `${Config.SERVER_URL}/`, // Image href path from browser: https://github.com/webpack/docs/wiki/Configuration#user-content-outputpublicpath
  },
  plugins,
  module: {
    rules: [
      { // Bable
        test: /\.js$/,
        exclude: /node_modules\/(?!(autotrack|dom-utils))/, // autotrack is published with ES6: https://github.com/googleanalytics/autotrack/issues/137
        loader: 'babel-loader',
        options: {
          presets: babelPresets,
        },
      },
      // Project CSS
      cssLoader,
      // Vendor CSS imported in src/App.js
      {
        test: /\.css$/,
        exclude: path.join(__dirname, 'src'),
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
      },
      { // Image: inline base64 URLs for <=8k images, direct URLs for the rest
        test: /\.(gif|jpe?g|png|svg)$/,
        loader: 'url-loader?limit=8192&name=[name]-[hash].[ext]',
      },
    ],
  },
};
