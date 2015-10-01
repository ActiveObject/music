var Kefir = require('kefir');
var { Map, Set, List } = require('immutable');
var { omit } = require('underscore');
var vbus = require('app/core/vbus');
var Atom = require('app/core/atom');
var { hasTag, addTag, removeTag } = require('app/Tag');
var tagOf = require('app/fn/tagOf');
var merge = require('app/fn/merge');

var player = {
  tag: [':app/player'],
  track: {
    audio: {}
  },
  position: 0,
  seekPosition: 0,
  bytesTotal: 0,
  bytesLoaded: 0,
  tracklist: List()
};

var initialDbValue = Map({
  ':db/albums': Set(),
  ':db/tracks': Set(),
  ':db/groups': Set(),
  ':db/activity': Set(),
  ':db/player': player,

  ':db/user': {
    tag: ':app/user'
  },

  ':db/visibleGroups': [],

  ':db/route': {
    tag: [':app/route', ':route/empty']
  },

  ':db/cmd': 'All tracks',

  ':db/command-palette': {
    tag: [':app/command-palette']
  },

  ':db/context': {
    tag: [':context/playlist']
  }
});

function commonReducer(state, v) {
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

  if (hasTag(v, ':app/player')) {
    return state.update(':db/player', () => v);
  }

  if (hasTag(v, ':app/user')) {
    return state.update(':db/user', () => v);
  }

  if (hasTag(v, ':app/route')) {
    return state.update(':db/route', () => v);
  }

  if (hasTag(v, ':app/cmd')) {
    return state.set(':db/cmd', v.value);
  }

  if (hasTag(v, ':app/command-palette')) {
    return state.set(':db/command-palette', v);
  }

  return state;
}

function detectArtistFilter(state, v) {
  if (!hasTag(v, ':app/cmd')) {
    return state;
  }

  var isCmdActivated = hasTag(state.get(':db/command-palette'), ':cmd/is-activated');
  var cmd = state.get(':db/cmd');

  if (!isCmdActivated) {
    return state;
  }

  if (cmd.indexOf(':artist') === -1) {
    return state;
  }

  var artist = cmd.slice(cmd.indexOf(':artist') + ':artist'.length).trim();

  if (!artist) {
    return state.update(':db/context', function (ctx) {
      return omit(removeTag(ctx, ':context/filter-by-artist'), 'filter');
    });
  }

  return state.update(':db/context', function (ctx) {
    return merge(addTag(ctx, ':context/filter-by-artist'), {
      filter: {
        value: artist
      }
    });
  });
}

function detectAlbumFilter(state, v) {
  if (!hasTag(v, ':app/cmd')) {
    return state;
  }

  var isCmdActivated = hasTag(state.get(':db/command-palette'), ':cmd/is-activated');
  var cmd = state.get(':db/cmd');

  if (!isCmdActivated) {
    return state;
  }

  if (cmd.indexOf(':album') === -1) {
    return state;
  }

  var album = cmd.slice(cmd.indexOf(':album') + ':album'.length).trim();

  if (!album) {
    return state.update(':db/context', function (ctx) {
      return omit(removeTag(ctx, ':context/filter-by-album'), 'filter');
    });
  }

  return state.update(':db/context', function (ctx) {
    return merge(addTag(ctx, ':context/filter-by-album'), {
      filter: {
        value: album,
        albums: state.get(':db/albums')
      }
    });
  });
}

function fallbackCmdToDefault(state, v) {
  if (!hasTag(v, ':app/command-palette')) {
    return state;
  }

  if (hasTag(v, ':cmd/is-activated')) {
    return state;
  }

  if (state.get(':db/cmd').trim()) {
    return state;
  }

  return state.set(':db/cmd', 'All tracks');
}

function pipeThroughReducers(...reducers) {
  return function (initialDbValue, v) {
    return reducers.reduce(function (dbVal, reducer) {
      return reducer(dbVal, v);
    }, initialDbValue);
  };
}

var db = new Atom(initialDbValue);
var reducer = pipeThroughReducers(commonReducer, detectArtistFilter, detectAlbumFilter, fallbackCmdToDefault);

vbus
  .scan(reducer, initialDbValue)
  .onValue(v => Atom.swap(db, v));

var changes = Kefir.stream(function (emitter) {
  return Atom.listen(db, function (nextDbValue) {
    emitter.emit(nextDbValue);
  });
});


module.exports = db;
module.exports.changes = changes;
