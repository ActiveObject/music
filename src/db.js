var Kefir = require('kefir');
var vbus = require('app/core/vbus');
var Atom = require('app/core/atom');
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
  ':db/user': { tag: ':app/user' },
  ':db/visibleGroups': []
});

function reducer(state, v) {
  if (tagOf(v) === ':app/albums') {
    return state.update(':db/albums', albums => albums.union(v[1]))
  }

  if (tagOf(v) === ':app/tracks') {
    return state.update(':db/tracks', tracks => tracks.union(v[1]))
  }

  if (tagOf(v) === ':app/groups') {
    var groups = state.get(':db/groups').union(v[1]);
    var visibleGroups = groups.slice(0, 10).map(v => v.id);

    return state.merge({
      ':db/groups': groups,
      ':db/visibleGroups': visibleGroups.toJS()
    });
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

var dbAtom = new Atom(initialDbValue);
var changes = vbus.scan(reducer, initialDbValue);

var dbInput = Kefir.stream(function (emitter) {
  return Atom.listen(dbAtom, function (nextDbValue) {
    emitter.emit(nextDbValue);
  });
});

changes.onValue(v => Atom.swap(dbAtom, v));

module.exports = dbInput;
module.exports.atom = dbAtom;
