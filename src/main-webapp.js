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
var { IHttpRequest } = require('app/Http');
var jsonpRequest = require('jsonp');

function System() {
  this.uninstallList = [];
}

System.prototype[IGetItem] = function (key, fn) {
  if (localStorage.hasOwnProperty(key)) {
    fn(localStorage.getItem(key));
  }
};

System.prototype[ISetItem] = function (item) {
  each(item, (value, key) => localStorage.setItem(key, value));
};

System.prototype[IHttpRequest] = function (url, callback) {
  return jsonpRequest(url, callback);
};

System.prototype.start = function () {
  if (Auth.hasToken(location.hash)) {
    Auth.storeToLs(location.hash);
    location.hash = '';
  }

  this.uninstallList.push(onValue(vbus.map(seq(0)), (produce) => db.modify(produce)));
  this.uninstallList.push(require('app/services/vk-indexing-service')(vbus));
  this.uninstallList.push(require('app/services/router-service')(vbus));
  this.uninstallList.push(require('app/services/vk-service')(vbus));
  this.uninstallList.push(require('app/services/auth-service')(vbus));
  this.uninstallList.push(require('app/services/soundmanager-service')(vbus));
  this.uninstallList.push(require('app/services/local-storage-service')(vbus));
};

System.prototype.stop = function() {
  this.uninstallList.forEach(uninstall => uninstall());
};

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
  .use(new System())
  .start();

vbus.emit(Auth.readFromLs());