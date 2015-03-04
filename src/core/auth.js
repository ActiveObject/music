var QS = require('querystring');
var Url = require('url');
var User = require('app/values/user');

exports.readFromLs = function readFromLs() {
  if (localStorage.getItem('user_id') && localStorage.getItem('access_token')) {
    return new User.Authenticated({
      id: localStorage.getItem('user_id'),
      accessToken: localStorage.getItem('access_token')
    });
  }

  return new User.Unauthenticated();
};

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

exports.storeToLs = function storeToLs(hash) {
  var credentials = QS.parse(hash.slice(1));

  localStorage.setItem('user_id', credentials.user_id);
  localStorage.setItem('access_token', credentials.access_token);
};