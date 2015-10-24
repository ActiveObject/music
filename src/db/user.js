var equal = require('deep-equal');
var db = require('app/db');
var Atom = require('app/Atom');
var user = new Atom(db.value.get(':db/user'));

db.changes
  .map(v => v.get(':db/user'))
  .skipDuplicates(equal)
  .onValue(v => Atom.swap(user, v));

module.exports = user;
