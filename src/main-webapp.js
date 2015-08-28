var Atom = require('app/core/atom');
var router = require('app/core/router');
var render = require('app/core/renderer')(document.getElementById('app'));
var app = require('app');
var WebappSystem = require('app/WebappSystem');
var db = require('app/db');
var vbus = require('app/core/vbus');

Atom.listen(router, render);

if (process.env.NODE_ENV === 'development') {
  window.app = app;
  window.db = db;
  window.vbus = vbus;
  // window.dev = require('app/devtool')(vbus)();
  // window.TimeRecord = require('app/devtool/time-record');
  // window.Perf = require('react/addons').addons.Perf;
  // window.stats = require('app/core/stats');

  // Perf.start();
  // vbus.log();
  // db.skipDuplicates().onValue(v => console.log(v.toJS()))
}


app
  .use(new WebappSystem())
  .start();