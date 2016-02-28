import { Map, List } from 'immutable';
import app, { run } from 'app';
import reducer from 'app/reducer';
import { render } from 'app/renderer';
import AppRootView from 'app/AppRootView';
import vk from 'app/vk';

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

var renderApp = render(<AppRootView />, document.getElementById('app'));

run(initialAppState, renderApp, reducer);

if (process.env.NODE_ENV === 'development') {
  window._app = app;
  window._vk = vk;
}
