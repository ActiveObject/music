var path = require('path');
var webpack = require('webpack');

if (!Number(process.env.MUSIC_APP_ID)) {
  throw new Error('MUSIC_APP_ID env var should be a number');
}

var definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    MUSIC_APP_ID: JSON.stringify(process.env.MUSIC_APP_ID)
  }
});

module.exports = {
  entry: './src/main.js',
  output: {
    path: './_public',
    filename: 'app.js'
  },
  module: {
    loaders: [
      { test: /app\/(.*)\.js$/, loader: 'esnext' },
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' },
      { test: require.resolve('react'), loader: 'expose?React' },
      { test: /\.jsx$/, loader: 'jsx-loader' }
    ]
  },
  externals: {
    'sound-manager': 'soundManager',
    'pouchdb': 'PouchDB',
    'firebase': 'Firebase'
  },
  watchDelay: 200,
  plugins: [
    definePlugin,
    new webpack.IgnorePlugin(/vertx/)
  ]
};