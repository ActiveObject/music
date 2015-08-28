var db = require('app/db');
var Atom = require('app/core/atom');
var List = require('immutable').List;
var LibraryTracklist = require('app/values/tracklists/library-tracklist');
var Playlist = require('app/values/playlist');

var player = {
  tag: [':app/player'],
  track: {
    audio: {}
  },
  position: 0,
  seekPosition: 0,
  bytesTotal: 0,
  bytesLoaded: 0,
  recentTracklists: [],
  tracklist: new LibraryTracklist({
    playlist: new Playlist({
      tracks: List(),
      isShuffled: false,
      isRepeated: false
    })
  })
};

var playerStream = db
  .map(v => v.get(':db/player'))
  .filter(Boolean)
  .skipDuplicates();

var playerAtom = new Atom(player);

playerStream.onValue(v => Atom.swap(playerAtom, v));

module.exports = playerAtom;
module.exports.changes = playerStream;
