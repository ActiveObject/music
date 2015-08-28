var ISet = require('immutable').Set;
var db = require('app/db');
var Atom = require('app/core/atom');

var tracks = new Atom(ISet());

db
  .map(v => v.get(':db/tracks'))
  .filter(Boolean)
  .skipDuplicates()
  .onValue(v => Atom.swap(tracks, v));

module.exports = tracks;
