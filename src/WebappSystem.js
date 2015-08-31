var querystring = require('querystring');
var each = require('underscore').each;
var vbus = require('app/core/vbus');
var onValue = require('app/fn/onValue');
var { IGetItem, ISetItem } = require('app/Storage');
var { IHttpRequest } = require('app/Http');
var jsonpRequest = require('jsonp');
var vkAccount = require('app/values/accounts/vk');

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
  var hash = location.hash;
  this.uninstallList.push(require('app/drivers/vk-indexing-driver')(vbus));
  this.uninstallList.push(require('app/drivers/route-driver')(vbus));
  this.uninstallList.push(require('app/drivers/vk-driver')(vbus));
  this.uninstallList.push(require('app/drivers/soundmanager-driver')(vbus));
  this.uninstallList.push(require('app/drivers/local-storage-driver')(vbus));
  this.uninstallList.push(require('app/drivers/audio-key-control-driver')(vbus));
  this.auth(hash);
};

System.prototype.stop = function() {
  this.uninstallList.forEach(uninstall => uninstall());
};

System.prototype.auth = function (hash) {
  function hasToken(hash) {
    return hash && querystring.parse(hash.slice(1)).access_token;
  }

  function isUserInStorage() {
    return localStorage.getItem('user_id') && localStorage.getItem('access_token');
  }

  if (hasToken(hash)) {
    var credentials = querystring.parse(hash.slice(1));

    localStorage.setItem('user_id', credentials.user_id);
    localStorage.setItem('access_token', credentials.access_token);

    return vbus.emit({
      tag: [':app/user', ':user/authenticated'],
      id: credentials.user_id,
      accessToken: credentials.access_token
    });
  }

  if (isUserInStorage()) {
    return vbus.emit({
      tag: [':app/user', ':user/authenticated'],
      id: localStorage.getItem('user_id'),
      accessToken: localStorage.getItem('access_token')
    });
  }

  return vbus.emit({ tag: [':app/route', ':route/auth'], authUrl: vkAccount.url });
};

module.exports = System;