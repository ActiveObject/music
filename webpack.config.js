var path = require('path');
var webpack = require('webpack');

module.exports = function (env) {
  var plugins = [];
  var entry = [];

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
    entry.push('react-hot-loader/patch');
    entry.push('./src/index.dev.js');
    plugins.push(new webpack.NamedModulesPlugin());
  } else {
    entry.push('./src/index.prod.js');
  }

  return {
    devtool: env === 'development' ? 'cheap-module-eval-source-map' : 'source-map',
    entry: entry,

    output: {
      path: path.join(__dirname, '_public'),
      filename: 'app.js'
    },

    module: {
      rules: [
        { test: /\.jsx?/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
        { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
        { test: /\.svg$/, use: 'svg-sprite-loader' }
      ]
    },

    resolve: {
      extensions: ['.js']
    },

    plugins: plugins,
    devServer: {
      contentBase: '_public',
      historyApiFallback: true
    }
  }
};
