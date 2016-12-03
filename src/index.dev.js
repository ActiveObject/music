import React from 'react';
import { render } from 'react-dom';
import { AppContainer as HotLoader } from 'react-hot-loader';
import Perf from 'react-addons-perf';
import MusicApp from 'app/MusicApp';
import vk from 'app/shared/vk';

render(
  <HotLoader>
    <MusicApp />
  </HotLoader>, document.querySelector('#app'));

if (module.hot) {
  module.hot.accept('app/MusicApp', () => {
    render(
      <HotLoader>
        <MusicApp />
      </HotLoader>, document.querySelector('#app'));
  });
}

window.Perf = Perf;
