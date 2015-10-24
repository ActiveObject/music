var db = require('app/db');
var Atom = require('app/Atom');
var route = new Atom(db.value.get(':db/route'));

db.changes
  .map(v => v.get(':db/route'))
  .skipDuplicates()
  .onValue(v => Atom.swap(route, v));

module.exports = route;
