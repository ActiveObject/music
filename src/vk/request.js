var Url = require('url');
var _ = require('underscore');
var request = require('app/core/request');

var Request = function (attrs) {
  this.entryPoint = attrs.entryPoint;
  this.token = attrs.token;
  this.callback = attrs.callback;
  this.attempt = attrs.attempt;
  this.method = attrs.method;
  this.params = attrs.params;
  this.version = attrs.version;

  this.url = Url.format({
    protocol: Url.parse(this.entryPoint).protocol,
    host: Url.parse(this.entryPoint).host,
    pathname: Url.parse(this.entryPoint).pathname + this.method,
    query: _.extend(this.params, {
      access_token: this.token,
      v: this.version
    })
  });
};

Request.prototype.send = function (callback) {
  request(this.url, function (err, data) {
    if (err) {
      return callback(err);
    }


    if (data.error) {
      return callback(data.error);
    }

    if (!data.response) {
      return callback(new Error('Missing response body'));
    }

    callback(null, data);
  });
};

Request.prototype.nextAttempt = function() {
  return this.modify({
    attempt: this.attempt + 1
  });
};

Request.prototype.modify = function(attrs) {
  return new Request(_.extend({}, this, attrs));
};

module.exports = Request;
