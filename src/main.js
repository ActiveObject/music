var Atom = require('app/Atom');
var db = require('app/db');
var render = require('app/renderer')(document.getElementById('app'));
var dispatch = require('app/dispatch');
var app = require('app');
var WebappSystem = require('app/WebappSystem');
var db = require('app/db');
var vbus = require('app/vbus');

Atom.listen(db.view(':db/route'), r => render(dispatch(r)));

if (process.env.NODE_ENV === 'development') {
  window._app = app;
  window._db = db;
  window._vbus = vbus;
  // window.dev = require('app/devtool')(vbus)();
  // window.TimeRecord = require('app/devtool/time-record');
  // window.Perf = require('react/addons').addons.Perf;
  // window.stats = require('app/core/stats');

  // Perf.start();
  // vbus.log();
  // db.skipDuplicates().onValue(v => console.log(v.toJS()))
  require('kefir').DEPRECATION_WARNINGS = false;
}

app
  .use(new WebappSystem())
  .start();