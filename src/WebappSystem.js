import { IGetItem, ISetItem } from 'app/Storage';
import { IHttpRequest } from 'app/Http';
import jsonpRequest from 'jsonp';

export default function (proto) {
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
}
