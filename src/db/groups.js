var ISet = require('immutable').Set;
var db = require('app/db');
var Atom = require('app/core/atom');

var groups = new Atom(ISet());

db
  .map(v => v.get(':db/groups'))
  .filter(Boolean)
  .skipDuplicates()
  .onValue(v => Atom.swap(groups, v));

module.exports = groups;
