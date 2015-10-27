import Kefir from 'kefir';
import { Map, List } from 'immutable';
import Atom from 'app/Atom';

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

var initialAppState = Map({
  ':db/albums': Map(),
  ':db/tracks': Map(),
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
  },

  ':db/tags': []
});

var state = new Atom(initialAppState);
var stateChanges = Kefir.fromEvents(state, 'change');

var app = {
  view: function (key, equal) {
    var x = new Atom(app.value.get(key));

    stateChanges
      .map(v => v.get(key))
      .skipDuplicates(equal)
      .onValue(v => Atom.swap(x, v));

    return x;
  },

  /**
   * Modifies app prototype chain:
   *
   * app -> System -> Atom -> EventEmitter -> Object
   */
  use: function (initSystem) {
    var appProto = Object.create(state);
    initSystem(appProto);
    Object.setPrototypeOf(app, appProto);
    return app;
  }
};

export default app
