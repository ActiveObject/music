var React = require('react');
var debug = require('debug')('app:renderer');

if (process.env.NODE_ENV === 'development') {
  var stats = require('app/core/stats');
}

module.exports = function (mountNode) {
  return function renderAppstate(layout) {
    if (!document.hidden) {
      debug('VDOM render started');

      if (process.env.NODE_ENV === 'development') {
        stats.time('render');
      }

      var root = layout.render();

      if (process.env.NODE_ENV === 'development') {
        stats.timeEnd('render');
      }

      debug('VDOM render finished');

      if (process.env.NODE_ENV === 'development') {
        stats.time('React.render');
      }

      React.render(root, mountNode);

      if (process.env.NODE_ENV === 'development') {
        stats.timeEnd('React.render');
      }
    }
  };
};
