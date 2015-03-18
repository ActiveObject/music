var Atom = require('app/core/atom');
var router = require('app/core/router');
var render = require('app/core/renderer')(document.getElementById('app'));

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

require('app/core/request').useXhr();

require('app/stores/activity-store');
require('app/stores/group-store');
require('app/stores/track-store');
require('app/stores/player-store');

require('app/services/vk-indexing-service');
require('app/chromeapp/auth-service');
require('app/services/vk-service');
require('app/services/soundmanager-service');
require('app/chromeapp/local-storage-service');
require('app/chromeapp/router-service');
