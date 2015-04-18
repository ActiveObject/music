var db = require('app/core/db3');
var emptyRoute = require('app/routes/empty-route');
var tagOf = require('app/fn/tagOf');

module.exports = db.scanEntity(emptyRoute, function(layout, v) {
  if (tagOf(v) === 'main-route' || tagOf(v) === 'group-route' || tagOf(v) === 'auth-route') {
    return v;
  }

  return layout;
});
