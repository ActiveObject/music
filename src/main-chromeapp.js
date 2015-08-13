var app = require('app');
var has = require('underscore').has;
var Atom = require('app/core/atom');
var router = require('app/core/router');
var render = require('app/core/renderer')(document.getElementById('app'));
var vbus = require('app/core/vbus');
var { IGetItem, ISetItem } = require('app/Storage');
var { IHttpRequest } = require('app/Http');
var Url = require('url');
var querystring = require('querystring');
var VError = require('verror');
var router = require('app/core/router');
var AuthRoute = require('app/routes/auth-route');
var vbus = require('app/core/vbus');
var vk = require('app/values/accounts/vk');


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
    require('app/services/vk-service')(vbus),
    require('app/services/soundmanager-service')(vbus),
    require('app/chromeapp/router-service'),
    require('app/services/local-storage-service')(vbus),
    require('app/services/audio-key-control')(vbus)
  ];

  this.auth();
};

System.prototype.stop = function () {
  this.uninstallList.forEach(uninstall => uninstall());
};

System.prototype.auth = function () {
  var vkAuthUrl = Url.format({
    protocol: Url.parse(vk.AUTH_URL).protocol,
    host: Url.parse(vk.AUTH_URL).host,
    pathname: Url.parse(vk.AUTH_URL).pathname,
    query: {
      client_id: vk.APP_ID,
      scope: vk.PERMISSIONS.join(','),
      redirect_uri: 'https://' + process.env.MUSIC_CHROME_APP_ID + '.chromiumapp.org/vk',
      display: vk.DISPLAY,
      v: vk.API_VERSION,
      response_type: 'token'
    }
  });

  chrome.identity.launchWebAuthFlow({
    url: vkAuthUrl,
    interactive: true
  }, function(redirectUrl) {
    if (!redirectUrl) {
      throw new VError(
        'Authentication failed: %s \n' +
        'Chrome App id: %s, check if it is the id of published app.',
        chrome.runtime.lastError.message,
        process.env.MUSIC_CHROME_APP_ID
      );
    }

    try {
      var hash = Url.parse(redirectUrl).hash.slice(1);
      var qs = querystring.parse(hash);
      var user = {
      });

      vbus.emit({
        tag: [':app/user', ':user/authenticated'],
        id: qs.user_id,
        accessToken: qs.access_token
      });
    } catch (e) {
      console.log(e);
    }
  });

  vbus.emit({ tag: ':app/user' });
};

Atom.listen(router, render);

app
  .use(new System())
  .start()
