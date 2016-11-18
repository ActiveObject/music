import setupHelpers from './setupHelpers';

var api = {};

api.request = function (method, params, callback) {
  return {
    method,
    params,
    callback,
    attempt: 0
  };
};

setupHelpers(api);

export default api;
