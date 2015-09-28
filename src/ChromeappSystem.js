var Url = require('url');
var querystring = require('querystring');
var VError = require('verror');
var has = require('underscore').has;
var vbus = require('app/core/vbus');
var { IGetItem, ISetItem } = require('app/Storage');
var { IHttpRequest } = require('app/Http');
var vk = require('app/values/accounts/vk');
var LastNWeeksDRange = require('app/values/last-nweeks-drange');

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
    require('app/drivers/vk-indexing-driver')(vbus),
    require('app/drivers/vk-driver')(vbus),
    require('app/drivers/soundmanager-driver')(vbus),
    require('app/drivers/local-storage-driver')(vbus),
    require('app/drivers/key-control-driver')(vbus)
  ];

  this.auth();
  vbus.emit({
    tag: [':app/route', ':route/main'],
    groups: [41293763, 32211876, 34110702, 28152291],
    period: new LastNWeeksDRange(32, new Date())
  });
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

module.exports = System;