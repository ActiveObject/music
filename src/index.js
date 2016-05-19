import { Map } from 'immutable';
import Atom from 'app/shared/Atom';
import reducer from 'app/reducer';

var initialAppState = Map({
  ':db/albums': Map(),
  ':db/player': {
    tag: [':app/player', ':player/empty'],
    position: 0,
    seekPosition: 0,
    bytesTotal: 0,
    bytesLoaded: 0,
    tracklist: []
  },

  ':db/library': [],
  ':db/groups': [],

  ':db/user': {
    tag: ':app/user'
  }
});

var app = new Atom(initialAppState);

app.push = function (v) {
  Atom.swap(app, reducer(app.value, v));
};

export default app;
