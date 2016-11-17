import setupHelpers from './setupHelpers';

var api = {};

api.request = function (method, options, done) {
  this.push({
    method: method,
    params: options,
    attempt: 0,
    callback: done
  });
};

setupHelpers(api);

export default api;
