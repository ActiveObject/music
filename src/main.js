import { render } from 'react-dom';
import app from 'app';
import AppRootView from 'app/app-root/AppRootView';
import StartApp from 'app/StartApp';
import vk from 'app/shared/vk';

render(
  <StartApp value={app}>
    <AppRootView />
  </StartApp>, document.querySelector('#app'));

window._app = app;
window._vk = vk;
