import ReactDOM from 'react-dom';
import app from 'app';
import WebappSystem from 'app/WebappSystem';
import Atom from 'app/Atom';
import vbus from 'app/vbus';
import reducer from 'app/reducer';
import AppRootView from 'app/AppRootView';

vbus.on('value', v => Atom.swap(app, reducer(app.value, v)));

app
  .use(WebappSystem)
  .start();

ReactDOM.render(<AppRootView />, document.getElementById('app'));

if (process.env.NODE_ENV === 'development') {
  window._app = app;
  window._vbus = vbus;
}
