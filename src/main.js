import { render } from 'react-dom';
import app from 'app';
import AppRootView from 'app/AppRootView';
import StartApp from 'app/StartApp';
import vk from 'app/vk';

render(
  <StartApp value={app}>
    <AppRootView />
  </StartApp>, document.querySelector('#app'));

if (process.env.NODE_ENV === 'development') {
  window._app = app;
  window._vk = vk;
}
