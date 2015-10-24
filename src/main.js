import ReactDOM from 'react-dom';
import db from 'app/db';
import app from 'app';
import WebappSystem from 'app/WebappSystem';
import vbus from 'app/vbus';
import AppRootView from 'app/AppRootView';

ReactDOM.render(<AppRootView />, document.getElementById('app'));

if (process.env.NODE_ENV === 'development') {
  window._app = app;
  window._db = db;
  window._vbus = vbus;
}

app
  .use(new WebappSystem())
  .start();