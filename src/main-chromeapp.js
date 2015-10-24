var app = require('app');
var Atom = require('app/Atom');
var render = require('app/renderer')(document.getElementById('app'));
var dispatch = require('app/dispatch');
var db = require('app/db');
var ChromeappSystem = require('app/ChromeappSystem');

if (process.env.NODE_ENV === 'development') {
  window._vbus = require('app/vbus');
  window._db = require('app/db');
  // window.dev = require('app/devtool')(app);
  // window.TimeRecord = require('app/devtool/time-record');
  // window.Perf = require('react/addons').addons.Perf;
  // window.stats = require('app/core/stats');

  // Perf.start();
  vbus.log();
}


Atom.listen(db.view(':db/route'), r => render(dispatch(r)));

app
  .use(new ChromeappSystem())
  .start()
