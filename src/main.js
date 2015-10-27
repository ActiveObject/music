import ReactDOM from 'react-dom';
import db from 'app/db';
import app from 'app';
import WebappSystem from 'app/WebappSystem';
import Atom from 'app/Atom';
import vbus from 'app/vbus';
import reducer from 'app/reducer';
import AppRootView from 'app/AppRootView';

vbus.on('value', v => Atom.swap(db, reducer(db.value, v)));

ReactDOM.render(<AppRootView />, document.getElementById('app'));

if (process.env.NODE_ENV === 'development') {
  window._app = app;
  window._db = db;
  window._vbus = vbus;
}

app
  .use(new WebappSystem())
  .start();