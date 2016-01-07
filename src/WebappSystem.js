import querystring from 'querystring';
import app from 'app';
import { IGetItem, ISetItem } from 'app/Storage';
import { IHttpRequest } from 'app/Http';
import jsonpRequest from 'jsonp';
import * as vkAccount from 'app/vkConfig';

export default function (proto) {
  var uninstallList = [];

  proto[IGetItem] = function (key, fn) {
    if (localStorage.hasOwnProperty(key)) {
      fn(localStorage.getItem(key));
    }
  };

  proto[ISetItem] = function (item) {
    Object.keys(item).forEach(key => {
      localStorage.setItem(key, item[key]);
    });
  };

  proto[IHttpRequest] = function (url, callback) {
    return jsonpRequest(url, callback);
  };

  proto.start = function () {
    var hash = location.hash;
    uninstallList.push(require('app/vk-indexer/driver')());
    uninstallList.push(require('app/route-driver')());
    uninstallList.push(require('app/vk/driver')());
    uninstallList.push(require('app/soundmanager/driver')());
    uninstallList.push(require('app/local-storage-driver')());
    uninstallList.push(require('app/key-control-driver')());
    proto.auth(hash);
  };

  proto.stop = function() {
    uninstallList.forEach(uninstall => uninstall());
  };

  proto.auth = function (hash) {
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

      return app.push({
        tag: [':app/user', ':user/authenticated'],
        id: credentials.user_id,
        accessToken: credentials.access_token
      });
    }

    if (isUserInStorage()) {
      return app.push({
        tag: [':app/user', ':user/authenticated'],
        id: localStorage.getItem('user_id'),
        accessToken: localStorage.getItem('access_token')
      });
    }

    return app.push({ tag: [':app/route', ':route/auth'], authUrl: vkAccount.url });
  };
}
