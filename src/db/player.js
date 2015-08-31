var db = require('app/db');
var Atom = require('app/core/atom');
var List = require('immutable').List;
var LibraryTracklist = require('app/values/tracklists/library-tracklist');
var Playlist = require('app/values/playlist');

var playerAtom = new Atom(db.value.get(':db/player'));
var playerStream = db.changes
  .map(v => v.get(':db/player'))
  .skipDuplicates();

playerStream.onValue(v => Atom.swap(playerAtom, v));

module.exports = playerAtom;
module.exports.changes = playerStream;
