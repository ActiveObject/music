var db = require('app/db');
var Atom = require('app/core/atom');
var tracks = new Atom(db.value.get(':db/tracks'));

db.changes
  .map(v => v.get(':db/tracks'))
  .skipDuplicates()
  .onValue(v => Atom.swap(tracks, v));

module.exports = tracks;
