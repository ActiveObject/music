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
  tracklist: new LibraryTracklist({
    playlist: new Playlist({
      tracks: List(),
      isShuffled: false,
      isRepeated: false
    })
  })
};

var initialDbValue = Map({
  ':db/albums': Set(),
  ':db/tracks': Set(),
  ':db/groups': Set(),
  ':db/activity': Set(),
  ':db/layout': emptyRoute,
  ':db/player': player,
  ':db/user': { tag: ':app/user' }
});

function reducer(state, v) {
  if (tagOf(v) === ':app/albums') {
    return state.update(':db/albums', albums => albums.union(v[1]))
  }

  if (tagOf(v) === ':app/tracks') {
    return state.update(':db/tracks', tracks => tracks.union(v[1]))
  }

  if (tagOf(v) === ':app/groups') {
    return state.update(':db/groups', groups => groups.union(v[1]))
  }

  if (tagOf(v) === ':app/activity') {
    return state.update(':db/activity', activity => activity.union(v[1]))
  }

  if (tagOf(v) === 'main-route' || tagOf(v) === 'group-route' || tagOf(v) === 'auth-route') {
    return state.update(':db/layout', () => v);
  }

  if (hasTag(v, ':app/player')) {
    return state.update(':db/player', () => v);
  }

  if (hasTag(v, ':app/user')) {
    return state.update(':db/user', () => v);
  }

  return state;
}

module.exports = vbus.scan(reducer, initialDbValue);
