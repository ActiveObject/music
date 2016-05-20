import { render } from 'react-dom';
import AppHost from 'app/AppHost';
import MusicApp from 'app/MusicApp';
import app from 'app';
import vk from 'app/shared/vk';

render(
  <AppHost value={app}>
    <MusicApp />
  </AppHost>, document.querySelector('#app'));

window._app = app;
window._vk = vk;
