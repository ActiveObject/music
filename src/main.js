var Atom = require('app/Atom');
var db = require('app/db');
var render = require('app/renderer')(document.getElementById('app'));
var dispatch = require('app/dispatch');
var app = require('app');
var WebappSystem = require('app/WebappSystem');
var vbus = require('app/vbus');

Atom.listen(db.view(':db/route'), r => render(dispatch(r)));

if (process.env.NODE_ENV === 'development') {
  window._app = app;
  window._db = db;
  window._vbus = vbus;
}

app
  .use(new WebappSystem())
  .start();