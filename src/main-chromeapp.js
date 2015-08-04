var app = require('app');
var has = require('underscore').has;
var Atom = require('app/core/atom');
var router = require('app/core/router');
var render = require('app/core/renderer')(document.getElementById('app'));
var vbus = require('app/core/vbus');
var { IGetItem, ISetItem } = require('app/Storage');
var { IHttpRequest } = require('app/Http');

if (process.env.NODE_ENV === 'development') {
  window.vbus = require('app/core/vbus');
  window.dev = require('app/devtool')(app);
  window.TimeRecord = require('app/devtool/time-record');
  window.Perf = require('react/addons').addons.Perf;
  window.stats = require('app/core/stats');

  Perf.start();
  vbus.log();
}

function System() {
  this.uninstallList = [];
}

System.prototype[IGetItem] = function (key, fn) {
  return chrome.storage.local.get(key, function (items) {
    if (has(items, key)) {
      fn(items[key]);
    }
  });
};

System.prototype[ISetItem] = function (item) {
  return chrome.storage.local.set(item, function () {});
};

System.prototype[IHttpRequest] = function (url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var body;

      try {
        body = JSON.parse(xhr.responseText);
      } catch (e) {
        return callback(e);
      }

      callback(null, body);
    }
  };

  return xhr.send();
};

System.prototype.start = function () {
  this.uninstallList = [
    require('app/services/vk-indexing-service')(vbus),
    require('app/chromeapp/auth-service'),
    require('app/services/vk-service')(vbus),
    require('app/services/soundmanager-service')(vbus),
    require('app/chromeapp/router-service'),
    require('app/services/local-storage-service')(vbus),
    require('app/services/audio-key-control')(vbus)
  ];
};

System.prototype.stop = function () {
  this.uninstallList.forEach(uninstall => uninstall());
};

Atom.listen(router, render);

app
  .use(new System())
  .start()

