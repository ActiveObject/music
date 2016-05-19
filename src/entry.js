import { render } from 'react-dom';
import app from 'app';
import AppRootView from 'app/app-root/AppRootView';
import AppHost from 'app/AppHost';
import vk from 'app/shared/vk';

render(
  <AppHost value={app}>
    <AppRootView />
  </AppHost>, document.querySelector('#app'));

window._app = app;
window._vk = vk;
