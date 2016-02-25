var path = require('path');
var webpack = require('webpack');

module.exports = function (env) {
  var plugins = [];
  var entry = ['./src/main.js'];

  if (!Number(process.env.MUSIC_APP_ID)) {
    throw new Error('MUSIC_APP_ID env var should be a number');
  }

  plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(env),
      MUSIC_APP_ID: JSON.stringify(process.env.MUSIC_APP_ID)
    }
  }));

  if (env === 'development') {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.NoErrorsPlugin());
    entry.unshift('webpack-hot-middleware/client');
  }

  return {
    devtool: env === 'development' ? 'cheap-module-eval-source-map' : 'source-map',
    entry: entry,

    output: {
      path: path.join(__dirname, '_public'),
      filename: 'app.js'
    },

    module: {
      preLoaders: [
        { test: /src\/(.*)\.(js|jsx)$/, loader: 'eslint' }
      ],

      loaders: [
        { test: /\.jsx?/, loaders: ['babel'], include: path.join(__dirname, 'src') },
        { test: /\.css$/, loaders: ['style', 'css', 'postcss'] },
        { test: require.resolve('react'), loader: 'expose?React' },
        { test: /\.svg$/, loader: 'svg-sprite' }
      ]
    },

    resolve: {
      extensions: ['', '.js', '.jsx']
    },

    plugins: plugins,
    postcss: [require('postcss-simple-vars')]
  }
};
