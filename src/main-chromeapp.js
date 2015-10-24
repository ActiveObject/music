var app = require('app');
var Atom = require('app/Atom');
var render = require('app/core/renderer')(document.getElementById('app'));
var dispatch = require('app/core/dispatch');
var router = require('app/db/route');
var ChromeappSystem = require('app/ChromeappSystem');

if (process.env.NODE_ENV === 'development') {
  window.vbus = require('app/core/vbus');
  window.db = require('app/db');
  // window.dev = require('app/devtool')(app);
  // window.TimeRecord = require('app/devtool/time-record');
  // window.Perf = require('react/addons').addons.Perf;
  // window.stats = require('app/core/stats');

  // Perf.start();
  vbus.log();
}


Atom.listen(router, r => render(dispatch(r)));

app
  .use(new ChromeappSystem())
  .start()
