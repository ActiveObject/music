import { Map, List } from 'immutable';
import app from 'app';
import WebappSystem from 'app/WebappSystem';
import reducer from 'app/reducer';
import { render } from 'app/renderer';
import AppRootView from 'app/AppRootView';
import vk from 'app/vk';

var initialAppState = Map({
  ':db/albums': Map(),
  ':db/tracks': Map(),

  ':db/player': {
    tag: [':app/player', ':player/empty'],
    position: 0,
    seekPosition: 0,
    bytesTotal: 0,
    bytesLoaded: 0,
    tracklist: List()
  },

  ':db/tracklist': ':tracklist/user-library',

  ':db/user': {
    tag: ':app/user'
  },

  ':db/visibleGroups': [],

  ':db/cmd': 'All tracks',

  ':db/command-palette': {
    tag: [':app/command-palette']
  },

  ':db/context': {
    tag: [':context/playlist']
  },

  ':db/tags': [],
  ':db/vk': {
    tag: []
  }
});

var renderApp = render(<AppRootView />, document.getElementById('app'));

app
  .use(WebappSystem)
  .run(initialAppState, renderApp, reducer);

if (process.env.NODE_ENV === 'development') {
  window._app = app;
  window._vk = vk;
}
