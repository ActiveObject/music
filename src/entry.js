import { render } from 'react-dom';
import AppHost from 'app/AppHost';
import AppRoot from 'app/app-root/AppRoot';
import app from 'app';
import vk from 'app/shared/vk';

render(
  <AppHost value={app}>
    <AppRoot />
  </AppHost>, document.querySelector('#app'));

window._app = app;
window._vk = vk;
