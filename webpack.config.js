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

// [name]: [sources] -> file.html output uses the same name. js/css files use [name] and will auto-append to file.html
const entry = Config.IS_DEVELOPMENT ? {
  index: ['babel-polyfill', './src/index', 'webpack-hot-middleware/client'],
} : {
  index: ['babel-polyfill', './src/index'],
};

const plugins = Config.IS_DEVELOPMENT ? [
  new webpack.optimize.OccurenceOrderPlugin(),
  new HtmlWebpackPlugin({
    template: 'src/index.html',
    inject: true,
    filename: 'index.html',
    showErrors: true,
  }),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
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
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
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
  new StatsPlugin('webpack.stats.json'),
  new WebpackShellPlugin({
    onBuildStart: ['echo "\n\n-----"', 'echo "Webpack Start"', 'echo "-----\n"'],
    onBuildEnd: ['echo "\n\n-----"', 'echo "Webpack End"', 'echo "-----\n"'],
  }),
  new webpack.NoErrorsPlugin(),
];

const babelPresets = Config.IS_DEVELOPMENT ? ['react', 'es2015', 'react-hmre'] : ['react', 'es2015'];

// Prefer react-css-modules over css-loader
// Source: https://github.com/gajus/react-css-modules#usage
const cssLoader = Config.IS_DEVELOPMENT ? {
  test: /\.css?$/,
  loaders: [
    'style?sourceMap',
    'css?modules&importLoaders=1&localIdentName=[path][name]__[local]__[hash:base64:5]!resolve-url!postcss',
  ],
} : {
  test: /\.css$/,
  loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[path][name]__[local]__[hash:base64:5]!resolve-url!postcss'),
  // This doesn't work for now: https://github.com/webpack/extract-text-webpack-plugin/issues/173
  // loader: ExtractTextPlugin.extract({
  //   notExtractLoader: 'style',
  //   loader: 'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]!resolve-url!postcss',
  // }),
};

module.exports = {
  devtool: 'source-map',
  // devtool: Config.IS_DEVELOPMENT ? 'eval-source-map' : null,
  entry,
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
