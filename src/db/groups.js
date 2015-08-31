var db = require('app/db');
var Atom = require('app/core/atom');
var groups = new Atom(db.value.get(':db/groups'));

db.changes
  .map(v => v.get(':db/groups'))
  .filter(Boolean)
  .skipDuplicates()
  .onValue(v => Atom.swap(groups, v));

module.exports = groups;
