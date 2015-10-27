import app from 'app';
import WebappSystem from 'app/WebappSystem';
import Atom from 'app/Atom';
import vbus from 'app/vbus';
import reducer from 'app/reducer';
import { render } from 'app/renderer';
import AppRootView from 'app/AppRootView';
import { Map, List } from 'immutable';

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

app
  .use(WebappSystem)
  .run(initialAppState, render(AppRootView, document.getElementById('app')), reducer)
  .start();

if (process.env.NODE_ENV === 'development') {
  window._app = app;
  window._vbus = vbus;
}
