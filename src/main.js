import Atom from 'app/Atom';
import db from 'app/db';
import renderer from 'app/renderer';
import dispatch from 'app/dispatch';
import app from 'app';
import WebappSystem from 'app/WebappSystem';
import vbus from 'app/vbus';

var render = renderer(document.getElementById('app'));

Atom.listen(db.view(':db/route'), r => render(dispatch(r)));

if (process.env.NODE_ENV === 'development') {
  window._app = app;
  window._db = db;
  window._vbus = vbus;
}

app
  .use(new WebappSystem())
  .start();