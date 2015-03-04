var Url = require('url');
var _ = require('underscore');
var jsonp = require('jsonp');

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
  if (chrome && chrome.identity) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var body;

        try {
          body = JSON.parse(xhr.responseText);
        } catch (e) {
          return callback(e);
        }

        if (body.error) {
          return callback(body.error);
        }

        if (!body.response) {
          return callback(new Error('Missing response body'));
        }

        callback(null, body);
      }
    };

    return xhr.send();
  }

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

Request.prototype.nextAttempt = function() {
  return this.modify({
    attempt: this.attempt + 1
  });
};

Request.prototype.modify = function(attrs) {
  return new Request(_.extend({}, this, attrs));
};

module.exports = Request;
