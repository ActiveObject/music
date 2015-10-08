var path = require('path');
var webpack = require('webpack');

if (!Number(process.env.MUSIC_APP_ID)) {
  throw new Error('MUSIC_APP_ID env var should be a number');
}

var definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    MUSIC_APP_ID: JSON.stringify(process.env.MUSIC_APP_ID),
    MUSIC_CHROME_APP_ID: JSON.stringify(process.env.MUSIC_CHROME_APP_ID)
  }
});

module.exports = {
  output: {
    filename: 'app.js'
  },
  module: {
    preLoaders: [
      { test: /src\/(.*)\.(js|jsx)$/, loader: 'eslint' }
    ],

    loaders: [
      { test: /src\/(.*)\.(js|jsx)$/, loader: 'babel-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader' },
      { test: require.resolve('react'), loader: 'expose?React' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  externals: {
    'sound-manager': 'soundManager',
    'firebase': 'Firebase'
  },
  plugins: [
    definePlugin,
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],

  postcss: [require('postcss-simple-vars')]
};
