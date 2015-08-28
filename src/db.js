var vbus = require('app/core/vbus');
var { Map, Set, List } = require('immutable');
var tagOf = require('app/fn/tagOf');
var hasTag = require('app/fn/hasTag');
var emptyRoute = require('app/routes/empty-route');
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

module.exports = vbus.scan(function (state, v) {
  if (tagOf(v) === ':app/albums') {
    return state.update(':db/albums', Set(), albums => albums.union(v[1]))
  }

  if (tagOf(v) === ':app/tracks') {
    return state.update(':db/tracks', Set(), tracks => tracks.union(v[1]))
  }

  if (tagOf(v) === ':app/groups') {
    return state.update(':db/groups', Set(), groups => groups.union(v[1]))
  }

  if (tagOf(v) === ':app/activity') {
    return state.update(':db/activity', Set(), activity => activity.union(v[1]))
  }

  if (tagOf(v) === 'main-route' || tagOf(v) === 'group-route' || tagOf(v) === 'auth-route') {
    return state.update(':db/layout', emptyRoute, () => v);
  }

  if (hasTag(v, ':app/player')) {
    return state.update(':db/player', player, () => v);
  }

  if (hasTag(v, ':app/user')) {
    return state.update(':db/user', { tag: ':app/user' }, () => v);
  }

  return state;
}, Map());
