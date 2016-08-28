import { createStore, compose } from 'redux';
import { persistState } from 'redux-devtools';
import DevTools from 'app/DevTools';
import reducers from 'app/reducers';
import { createPlayer } from 'app/shared/Player';

let store = createStore(reducers, createPlayer(), compose(DevTools.instrument(), persistState(getDebugSessionKey())));

function getDebugSessionKey() {
  const matches = window.location.href.match(/[?&]debug_session=([^&#]+)\b/);
  return (matches && matches.length > 0)? matches[1] : null;
}

if (module.hot) {
  module.hot.accept('app/reducers', () =>
    store.replaceReducer(require('app/reducers'))
  );
}

export default store;
