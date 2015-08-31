var db = require('app/db');
var Atom = require('app/core/atom');
var albums = new Atom(db.value.get(':db/albums'));

db.changes
  .map(v => v.get(':db/albums'))
  .filter(Boolean)
  .skipDuplicates()
  .onValue(v => Atom.swap(albums, v));

module.exports = albums;
