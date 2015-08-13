var db = require('app/core/db3');
var hasTag = require('app/fn/hasTag');

module.exports = db.scanEntity({ tag: ':app/user' }, function (currentUser, v) {
  return hasTag(v, ':app/user') ? v : currentUser;
});