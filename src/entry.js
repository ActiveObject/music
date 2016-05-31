import 'react-hot-loader/patch';
import { render } from 'react-dom';
import AppHost from 'app/AppHost';
import MusicApp from 'app/MusicApp';
import app from 'app';
import vk from 'app/shared/vk';
import { AppContainer as HotLoader } from 'react-hot-loader';

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
