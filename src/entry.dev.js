import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { AppContainer as HotLoader } from 'react-hot-loader';
import app from 'app';
import AppHost from 'app/AppHost';
import MusicApp from 'app/MusicApp';
import vk from 'app/shared/vk';
import Perf from 'react-addons-perf';
import DevTools from 'app/DevTools';
import store from 'app/store.dev';

render(
  <HotLoader>
    <Provider store={store}>
      <AppHost value={app}>
        <div>
          <MusicApp />
          <DevTools />
        </div>
      </AppHost>
    </Provider>
  </HotLoader>, document.querySelector('#app'));

if (module.hot) {
  module.hot.accept('app/MusicApp', () => {
    render(
      <HotLoader>
        <AppHost value={app}>
          <MusicApp />
        </AppHost>
      </HotLoader>, document.querySelector('#app'));
  });
}

window._app = app;
window._vk = vk;
window.Perf = Perf;
