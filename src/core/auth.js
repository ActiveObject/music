var QS = require('querystring');
var User = require('app/models/user');

exports.readFromLs = function readFromLs() {
  if (localStorage.getItem('user_id') && localStorage.getItem('access_token')) {
    return new User.Authenticated({
      id: localStorage.getItem('user_id'),
      accessToken: localStorage.getItem('access_token')
    });
  }

  return new User.Unauthenticated();
};

exports.hasToken = function hasToken(hash) {
  return hash && QS.parse(hash.slice(1)).access_token;
};

exports.storeToLs = function storeToLs(hash) {
  var credentials = QS.parse(hash.slice(1));

  localStorage.setItem('user_id', credentials.user_id);
  localStorage.setItem('access_token', credentials.access_token);
};