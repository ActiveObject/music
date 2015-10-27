import { Map, List } from 'immutable';
import app from 'app';
import WebappSystem from 'app/WebappSystem';
import reducer from 'app/reducer';
import { render } from 'app/renderer';
import AppRootView from 'app/AppRootView';

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

var renderApp = render(AppRootView, document.getElementById('app'));

app
  .use(WebappSystem)
  .run(initialAppState, renderApp, reducer)
  .start();

if (process.env.NODE_ENV === 'development') {
  window._app = app;
}
