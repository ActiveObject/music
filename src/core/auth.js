var QS = require('querystring');
var Url = require('url');
var User = require('app/values/user');

exports.readFromUrl = function readFromUrl(url) {
  var hash = Url.parse(url).hash.slice(1);
  var qs = QS.parse(hash);

  return new User.Authenticated({
    id: qs.user_id,
    accessToken: qs.access_token
  });
};

exports.hasToken = function hasToken(hash) {
  return hash && QS.parse(hash.slice(1)).access_token;
};

exports.isUserInStorage = function () {
  return localStorage.getItem('user_id') && localStorage.getItem('access_token');
};