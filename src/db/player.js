var Kefir = require('kefir');
var db = require('app/core/db3');
var List = require('immutable').List;
var hasTag = require('app/fn/hasTag');
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

module.exports = db.scanEntity(player, (acc, v) => hasTag(v, ':app/player') ? v : acc);
module.exports.changes = Kefir.fromEvent(module.exports, 'change');
