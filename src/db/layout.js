var Atom = require('app/core/atom');
var db = require('app/core/db3');
var emptyRoute = require('app/routes/empty-route');
var tagOf = require('app/utils/tagOf');
var scan = require('app/core/db/consumers/scan');
var layout = new Atom(emptyRoute);

db.install(scan(emptyRoute, function(layout, v) {
  if (tagOf(v) === 'main-route' || tagOf(v) === 'group-route') {
    return v;
  }

  return layout;
})).onValue(v => Atom.swap(layout, v));

module.exports = layout;
