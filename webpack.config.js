var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/main.js',
  output: {
    path: './_public',
    filename: 'app.js'
  },
  module: {
    loaders: [
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }
    ]
  },
  externals: {
    'sound-manager': 'soundManager'
  },
  watchDelay: 200,
  plugins: [
    new webpack.IgnorePlugin(/vertx/)
  ]
};