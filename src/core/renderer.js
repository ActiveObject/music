var React = require('react');
var debug = require('debug')('app:renderer');
var stats = require('app/core/stats');

module.exports = function (mountNode) {
  return function renderAppstate(v) {
    if (!document.hidden) {
      debug('VDOM render started');
      var startTime = Date.now();
      var root = v.get('activeRoute').render(v);

      stats.push({
        name: 'render',
        startTime: startTime,
        endTime: Date.now()
      });

      debug('VDOM render finished');

      React.render(root, mountNode);
    }
  };
};
