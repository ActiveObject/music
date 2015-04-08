var each = require('underscore').each;
var Atom = require('app/core/atom');
var router = require('app/core/router');
var render = require('app/core/renderer')(document.getElementById('app'));
var db = require('app/core/db3');
var vbus = require('app/core/vbus');
var onValue = require('app/utils/onValue');
var seq = require('app/core/db/producers/seq');

var app = {
  uninstallList: [],

  stop: function() {
    app.uninstallList.forEach(uninstall => uninstall());
    app.uninstallList = [];
  },

  start: function() {
    app.uninstallList.push(onValue(vbus.map(seq(0)), (produce) => db.modify(produce)));
  }
};

Atom.listen(router, render);

require('app/core/request').useJsonp();

if (process.env.NODE_ENV === 'development') {
  window.app = app;
  window.vbus = require('app/core/vbus');
  window.dev = require('app/devtool')(vbus)();
  window.TimeRecord = require('app/devtool/time-record');
  window.Perf = require('react/addons').addons.Perf;
  window.stats = require('app/core/stats');

  Perf.start();
  // vbus.log();
}

app.start();

require('app/services/vk-indexing-service');
require('app/services/router-service');
require('app/services/vk-service');
require('app/services/auth-service');
require('app/services/soundmanager-service');

var out = require('app/services/local-storage-service')(function (key, fn) {
  if (localStorage.hasOwnProperty(key)) {
    fn(localStorage.getItem(key));
  }
});

out.onValue(function (item) {
  each(item, (value, key) => localStorage.setItem(key, value));
});
