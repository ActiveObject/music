import groupBy from 'lodash/groupBy';
import head from 'lodash/head';
import methods from './methods';

var vk = {};

vk.request = function (method, params, callback) {
  return {
    type: "vk-request",
    detail: {
      method,
      params,
      callback,
      attempt: 0
    }
  };
};

setupHelpers(vk);

function not(predicate, ctx) {
  return function not() {
    return !predicate.apply(ctx, arguments);
  };
}

function setupHelpers(apiObj) {
  var makeRequest = function (api, method, group) {
    var mname = group ? [group, method].join('.') : method;
    api[method] = function (options, callback) {
      return apiObj.request(mname, options, callback);
    };
    return api;
  };

  // setup global api methods
  var globalMethods = methods.map(m => m.split('.')).filter(isGlobal);
  globalMethods.map(head).reduce(function (api, method) {
    return makeRequest(api, method);
  }, apiObj);

  // setup api methods by group
  var groupedMethods = methods.map(m => m.split('.')).filter(not(isGlobal));
  var group  = function (item) { return item[0]; };
  var method = function (item) { return item[1]; };

  var byGroup = groupBy(groupedMethods, group);

  Object.keys(byGroup).reduce(function (api, gname) {
    api[gname] = byGroup[gname].reduce(function (api, item) {
      return makeRequest(api, method(item), group(item));
    }, {});
    return api;
  }, apiObj);
}

function isGlobal(method) {
  return method.length === 1;
}

export default vk;
