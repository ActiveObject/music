var Atom = require('app/core/atom');
var db3 = require('app/core/db3');
var dbin = require('app/core/dbin');
var emptyRoute = require('app/routes/empty-route');
var tagOf = require('app/utils/tagOf');

var layout = new Atom(emptyRoute);

db3.install(db3.scan(emptyRoute, function(layout, v) {
  if (tagOf(v) === 'main-route' || tagOf(v) === 'group-route') {
    return v;
  }

  return layout;
}), dbin).onValue(v => Atom.swap(layout, v));

module.exports = layout;
