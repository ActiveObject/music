import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer as HotLoader } from 'react-hot-loader';
import MusicApp from 'app/MusicApp';
import vk from 'app/shared/vk';
import Perf from 'react-addons-perf';
import DevTools from 'app/DevTools';
import store from 'app/store.dev';

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
        <MusicApp />
      </HotLoader>, document.querySelector('#app'));
  });
}

window._app = app;
window._vk = vk;
window.Perf = Perf;
