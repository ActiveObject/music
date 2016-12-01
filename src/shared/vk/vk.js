import methods from './methods';

export default function vk(method, params, callback) {
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

methods.map(m => m.split('.')).forEach(method => {
  var isGlobal = method.length === 1;

  if (isGlobal) {
    vk[method] = (options, callback) => vk(method, options, callback);
    return;
  }

  if (!vk[method[0]]) {
    vk[method[0]] = {};
  }

  vk[method[0]][method[1]] = (options, callback) => vk(method.join('.'), options, callback);
});
