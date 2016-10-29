import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { persistState } from 'redux-devtools';
import { Provider } from 'react-redux';
import { AppContainer as HotLoader } from 'react-hot-loader';
import Perf from 'react-addons-perf';
import MusicApp from 'app/MusicApp';
import vk from 'app/shared/vk';
import DevTools from 'app/MusicApp/DevTools';
import rootReducer from 'app/redux';

const store = createStore(rootReducer, compose(DevTools.instrument(), persistState(getDebugSessionKey())));

render(
  <HotLoader>
    <Provider store={store}>
      <div>
        <MusicApp />
        <DevTools />
      </div>
    </Provider>
  </HotLoader>, document.querySelector('#app'));

if (module.hot) {
  module.hot.accept('app/MusicApp', () => {
    render(
      <HotLoader>
        <Provider store={store}>
          <div>
            <MusicApp />
            <DevTools />
          </div>
        </Provider>
      </HotLoader>, document.querySelector('#app'));
  });

  module.hot.accept('app/redux', () =>
    store.replaceReducer(require('app/redux'))
  );
}

function getDebugSessionKey() {
  const matches = window.location.href.match(/[?&]debug_session=([^&#]+)\b/);
  return (matches && matches.length > 0)? matches[1] : null;
}

window._app = app;
window._vk = vk;
window.Perf = Perf;
