var React = require('react');
var debug = require('debug')('app:renderer');

if (process.env.NODE_ENV === 'development') {
  var stats = require('app/core/stats');
}

module.exports = function (mountNode) {
  return function renderAppstate(v) {
    if (!document.hidden) {
      debug('VDOM render started');

      if (process.env.NODE_ENV === 'development') {
        stats.time('render');
      }

      var root = v.get('activeRoute').render(v);

      if (process.env.NODE_ENV === 'development') {
        stats.timeEnd('render');
      }

      debug('VDOM render finished');

      React.render(root, mountNode);
    }
  };
};
