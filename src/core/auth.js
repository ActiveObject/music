var QS = require('querystring');

exports.readFromLs = function readFromLs(appstate) {
  if (localStorage.getItem('user_id') && localStorage.getItem('access_token')) {
    return appstate.set('user', {
      accounts: {
        vk: {
          user_id: localStorage.getItem('user_id'),
          access_token: localStorage.getItem('access_token')
        }
      }
    });
  }

  return appstate;
};

exports.hasToken = function hasToken(hash) {
  return hash && QS.parse(hash.slice(1)).access_token;
};

exports.storeToLs = function storeToLs(hash) {
  var credentials = QS.parse(hash.slice(1));

  localStorage.setItem('user_id', credentials.user_id);
  localStorage.setItem('access_token', credentials.access_token);
};