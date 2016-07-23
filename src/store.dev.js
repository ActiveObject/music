import { createStore } from 'redux';
import DevTools from 'app/DevTools';
import reducers from 'app/reducers';
import { createPlayer } from 'app/shared/Player';

let store = createStore(reducers, createPlayer(), DevTools.instrument());

if (module.hot) {
  module.hot.accept('app/reducers', () =>
    store.replaceReducer(require('app/reducers'))
  );
}

export default store;
