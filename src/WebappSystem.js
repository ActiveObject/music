import app from 'app';
import { IGetItem, ISetItem } from 'app/Storage';
import { IHttpRequest } from 'app/Http';
import jsonpRequest from 'jsonp';

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
    uninstallList.push(require('app/vk-indexer/driver')());
    uninstallList.push(require('app/vk/driver')());
    uninstallList.push(require('app/soundmanager/driver')());
    uninstallList.push(require('app/local-storage-driver')());
    uninstallList.push(require('app/key-control-driver')());
  };

  proto.stop = function() {
    uninstallList.forEach(uninstall => uninstall());
  };
}
