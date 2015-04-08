var Kefir = require('kefir');
var each = require('underscore').each;
var Atom = require('app/core/atom');
var router = require('app/core/router');
var render = require('app/core/renderer')(document.getElementById('app'));
var db3 = require('app/core/db3');
var vbus = require('app/core/vbus');
var onValue = require('app/utils/onValue');
var plug = require('app/utils/plug');
var addToSet = require('app/utils/addToSet');
var tagOf = require('app/utils/tagOf');
var seq = require('app/core/db/producers/seq');
var changelog = require('app/core/db/producers/changelog');

var app = {
  // uninstallList: [],
  // ticks: [],

  // installQueries: function() {
    // db.install(require('app/db/tracks'), addToSet(':app/tracks'));
    // db.install(require('app/db/albums'), addToSet(':app/albums'));
    // db.install(require('app/db/activity'), addToSet(':app/activity'));
    // db.install(require('app/db/layout'), function(layout, v) {
    //   if (tagOf(v) === 'main-route' || tagOf(v) === 'group-route') {
    //     return v;
    //   }

    //   return layout;
    // })
  // },

  stop: function() {
  //   app.uninstallList.forEach(uninstall => uninstall());
  //   app.uninstallList = [];
  },

  start: function() {
    // app.installQueries();
    // app.uninstallList.push(onValue(vbus.map(v => db.tick(v)), tx => app.ticks.push(tx)));
  },

  // replay: function() {
    // app.stop();
    // db.reset();
    // app.installQueries();
    // app.ticks.forEach(tick => db.tick(tick.tick.value));
  // }
};

window.values = [];

vbus.onValue(v => values.push(v));
var unplug = onValue(vbus.map(seq(0)), function (produce) {
  db3.modify(produce);
});

window.replay = function(vs) {
  unplug();
  db3.modify(changelog(vs));
};

window.play = function () {
  unplug();
  var event = seq(0);
  db3.modify(changelog([]));

  function next(vs) {
    if (vs.length === 0) {
      return console.log('STOP');
    }

    db3.modify(event(vs[0]));
    setTimeout(() => next(vs.slice(1)), 100);
  }

  next(values);
};

Atom.listen(router, render);
app.start();

require('app/core/request').useJsonp();

require('app/services/vk-indexing-service');
require('app/services/router-service');
require('app/services/vk-service');
require('app/services/auth-service');
require('app/services/soundmanager-service');

// var out = require('app/services/local-storage-service')(function (key, fn) {
//   if (localStorage.hasOwnProperty(key)) {
//     fn(localStorage.getItem(key));
//   }
// });

// out.onValue(function (item) {
//   each(item, (value, key) => localStorage.setItem(key, value));
// });

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
