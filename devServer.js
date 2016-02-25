var path = require('path');
var express = require('express');
var fallback = require('express-history-api-fallback')
var webpack = require('webpack');
var config = require('./webpack.config')('development');

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
app.use(express.static(config.output.path));
app.use(fallback('index.html', { root: config.output.path }));

app.listen(5003, 'localhost', function(err) {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://localhost:5003');
});
