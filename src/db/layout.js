var db = require('app/core/db3');
var emptyRoute = require('app/routes/empty-route');
var tagOf = require('app/utils/tagOf');

module.exports = db.scanEntity(emptyRoute, function(layout, v) {
  if (tagOf(v) === 'main-route' || tagOf(v) === 'group-route') {
    return v;
  }

  return layout;
});
