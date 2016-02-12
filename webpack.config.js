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
  devtool: 'source-map',
  entry: './src/main.js',

  output: {
    path: '_public',
    filename: 'app.js'
  },

  module: {
    preLoaders: [
      { test: /src\/(.*)\.(js|jsx)$/, loader: 'eslint' }
    ],

    loaders: [
      { test: /src\/(.*)\.(js|jsx)$/, loaders: ['react-hot', 'babel-loader'] },
      { test: /\.css$/, loaders: ['style', 'css', 'postcss'] },
      { test: require.resolve('react'), loader: 'expose?React' },
      { test: /\.svg$/, loader: 'svg-sprite' }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  plugins: [definePlugin],
  postcss: [require('postcss-simple-vars')]
};
