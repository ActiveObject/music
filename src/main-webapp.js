var Atom = require('app/core/atom');
var router = require('app/core/router');
var render = require('app/core/renderer')(document.getElementById('app'));
var app = require('app');
var WebappSystem = require('app/WebappSystem');

Atom.listen(router, render);

if (process.env.NODE_ENV === 'development') {
  window.app = app;
  window.vbus = require('app/core/vbus');
  window.dev = require('app/devtool')(vbus)();
  window.TimeRecord = require('app/devtool/time-record');
  window.Perf = require('react/addons').addons.Perf;
  window.stats = require('app/core/stats');

  Perf.start();
  vbus.log();
}

app
  .use(new WebappSystem())
  .start();