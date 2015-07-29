var each = require('underscore').each;
var Atom = require('app/core/atom');
var Auth = require('app/core/auth');
var router = require('app/core/router');
var render = require('app/core/renderer')(document.getElementById('app'));
var db = require('app/core/db3');
var vbus = require('app/core/vbus');
var onValue = require('app/fn/onValue');
var seq = require('app/core/db/producers/seq');
var app = require('app');
var { IGetItem, ISetItem } = require('app/Storage');

app.use({
  [IGetItem]: function (key, fn) {
    if (localStorage.hasOwnProperty(key)) {
      fn(localStorage.getItem(key));
    }
  },

  [ISetItem]: function (item) {
    each(item, (value, key) => localStorage.setItem(key, value));
  }
});

var app = {
  uninstallList: [],

  stop: function() {
    app.uninstallList.forEach(uninstall => uninstall());
    app.uninstallList = [];
  },

  start: function() {
    app.uninstallList.push(onValue(vbus.map(seq(0)), (produce) => db.modify(produce)));
    app.uninstallList.push(require('app/services/vk-indexing-service')(vbus));
    app.uninstallList.push(require('app/services/router-service')(vbus));
    app.uninstallList.push(require('app/services/vk-service')(vbus));
    app.uninstallList.push(require('app/services/auth-service')(vbus));
    app.uninstallList.push(require('app/services/soundmanager-service')(vbus));
    app.uninstallList.push(require('app/services/local-storage-service')(vbus));
  }
};

if (Auth.hasToken(location.hash)) {
  Auth.storeToLs(location.hash);
  location.hash = '';
}

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
  vbus.log();
}

app.start();

vbus.emit(Auth.readFromLs());