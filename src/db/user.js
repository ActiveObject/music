var db = require('app/core/db3');
var User = require('app/values/user');
var tagOf = require('app/utils/tagOf');

module.exports = db.scanEntity(new User.Unauthenticated(), function (currentUser, v) {
  if (tagOf(v) === ':app/authenticated-user' || tagOf(v) === ':app/unauthenticated-user') {
    return v;
  }

  return currentUser;
});