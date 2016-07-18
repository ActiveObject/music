import React from 'react';
import { render } from 'react-dom';
import { AppContainer as HotLoader } from 'react-hot-loader';
import app from 'app';
import AppHost from 'app/AppHost';
import MusicApp from 'app/MusicApp';
import vk from 'app/shared/vk';
import Perf from 'react-addons-perf';

render(
  <HotLoader>
    <AppHost value={app}>
      <MusicApp />
    </AppHost>
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
