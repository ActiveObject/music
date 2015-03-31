var Atom = require('app/core/atom');
var router = require('app/core/router');
var render = require('app/core/renderer')(document.getElementById('app'));
var db = require('app/core/db');
var vbus = require('app/core/vbus');
var onValue = require('app/utils/onValue');

if (process.env.NODE_ENV === 'development') {
  window.vbus = require('app/core/vbus');
  window.dev = require('app/devtool')(vbus)();
  window.TimeRecord = require('app/devtool/time-record');
  window.Perf = require('react/addons').addons.Perf;
  window.stats = require('app/core/stats');
  window.db = db;

  Perf.start();
  // vbus.log();
}

Atom.listen(router, render);

window.unsub = onValue(vbus, v => db.tick(v));

require('app/core/request').useJsonp();

require('app/services/vk-indexing-service');
require('app/services/router-service');
require('app/services/vk-service');
require('app/services/auth-service');
require('app/services/soundmanager-service');
// require('app/services/local-storage-service');
