var path = require('path');
var colors = require('colors');
var static = require('node-static');
var mime = require('mime');

var port = process.env.PORT || 5003;
var publicPath = process.env.PUBLIC_PATH || '_public';
var fileServer = new(static.Server)(path.resolve(publicPath));

var server = require('http').createServer(function (req, res) {
  console.log('[%s] "%s %s" "%s"', (new Date).toUTCString(), req.method.cyan, req.url.cyan, req.headers['user-agent']);

  req.addListener('end', function () {
    if (mime.lookup(req.url) === 'application/octet-stream') {
      return fileServer.serveFile('index.html', 200, {}, req, res);
    }

    fileServer.serve(req, res);
  }).resume();
});

server.listen(port, function (err) {
  if (err) {
    throw err;
  }

  var url = 'http://' + server.address().address + ':' + server.address().port;

  console.log('Starting up http server, serving %s on: %s', publicPath.cyan, url.cyan);
});
