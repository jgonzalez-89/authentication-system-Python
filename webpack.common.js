const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: [
    './src/front/js/index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  module: {
    rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.(css|scss)$/, use: [{
              loader: "style-loader" // creates style nodes from JS strings
          }, {
              loader: "css-loader" // translates CSS into CommonJS
          }]
        }, //css only files
        {
          test: /\.(png|svg|jpg|gif|jpeg|webp)$/, use: {
            loader: 'file-loader',
            options: { name: '[name].[ext]' }
          }
        }, //for images
        { test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/, use: ['file-loader'] } //for fonts
    ]
  },
  resolve: {
    fallback: {
      assert: require.resolve('assert/'),
      crypto: require.resolve('crypto-browserify'),
      buffer: require.resolve('buffer/'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/')
    },
    extensions: ['*', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
        favicon: '4geeks.ico',
        template: 'template.html'
    }),
    new Dotenv({ safe: true, systemvars: true }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ]
};