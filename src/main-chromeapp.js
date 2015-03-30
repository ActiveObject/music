var Atom = require('app/core/atom');
var router = require('app/core/router');
var render = require('app/core/renderer')(document.getElementById('app'));
var db = require('app/core/db');
var vbus = require('app/core/vbus');

if (process.env.NODE_ENV === 'development') {
  window.vbus = require('app/core/vbus');
  window.dev = require('app/devtool')(app);
  window.TimeRecord = require('app/devtool/time-record');
  window.Perf = require('react/addons').addons.Perf;
  window.stats = require('app/core/stats');

  Perf.start();
  vbus.log();
}

Atom.listen(router, render);

db.in.plug(vbus);

require('app/core/request').useXhr();

require('app/services/vk-indexing-service');
require('app/chromeapp/auth-service');
require('app/services/vk-service');
require('app/services/soundmanager-service');
// require('app/chromeapp/local-storage-service');
require('app/chromeapp/router-service');
