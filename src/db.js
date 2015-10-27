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

var initialDbValue = Map({
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

var db = new Atom(initialDbValue);
var dbChanges = Kefir.fromEvents(db, 'change');

db.view = function (key, equal) {
  var x = new Atom(db.value.get(key));

  dbChanges
    .map(v => v.get(key))
    .skipDuplicates(equal)
    .onValue(v => Atom.swap(x, v));

  return x;
};

export default db;
