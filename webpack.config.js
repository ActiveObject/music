var path = require('path');
var webpack = require('webpack');

if (!Number(process.env.MUSIC_APP_ID)) {
  throw new Error('MUSIC_APP_ID env var should be a number');
}

if (!process.env.MUSIC_APP_HOST) {
  throw new Error('MUSIC_APP_HOST env var should be a valid hostname');
}

var definePlugin = new webpack.DefinePlugin({
  __MUSIC_APP_HOST__: JSON.stringify(process.env.MUSIC_APP_HOST),
  __MUSIC_APP_ID__: JSON.stringify(process.env.MUSIC_APP_ID)
});

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
    definePlugin,
    new webpack.IgnorePlugin(/vertx/)
  ]
};