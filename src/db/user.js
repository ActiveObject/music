var db = require('app/db');
var Atom = require('app/core/atom');
var user = new Atom(db.value.get(':db/user'));

db.changes
  .map(v => v.get(':db/user'))
  .filter(Boolean)
  .skipDuplicates()
  .onValue(v => Atom.swap(user, v));

module.exports = user;
