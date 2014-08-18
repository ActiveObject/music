var Url = require('url');
var jsonp = require('jsonp');

var Request = function (url, time, params, callback) {
  this.url = Url.format({
    protocol: Url.parse(url).protocol,
    host: Url.parse(url).host,
    pathname: Url.parse(url).pathname,
    query: params
  });

  this.callback = callback;
  this.time = time;
  this.attempt = 0;
};

Request.prototype.send = function (callback) {
  jsonp(this.url, function (err, data) {
    if (err) {
      return callback(err);
    }

    if (!data.response) {
      return callback(new Error('Missing response body'));
    }

    callback(null, data);
  });
};

module.exports = Request;