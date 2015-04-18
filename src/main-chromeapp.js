var has = require('underscore').has;
var Atom = require('app/core/atom');
var router = require('app/core/router');
var render = require('app/core/renderer')(document.getElementById('app'));
var vbus = require('app/core/vbus');
var onValue = require('app/fn/onValue');
var addToSet = require('app/fn/addToSet');

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

require('app/services/vk-indexing-service');
require('app/chromeapp/auth-service');
require('app/services/vk-service');
require('app/services/soundmanager-service');
require('app/chromeapp/router-service');

var out = require('app/services/local-storage-service')(function (key, fn) {
  chrome.storage.local.get(key, function (items) {
    if (has(items, key)) {
      fn(items[key]);
    }
  });
});

out.onValue(item => chrome.storage.local.set(item, function () {}));
