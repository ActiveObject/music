var React = require('react');
var debug = require('debug')('app:renderer');

module.exports = function (mountNode) {
  return function renderAppstate(v) {
    if (!document.hidden) {
      debug('VDOM render started');
      var root = v.get('activeRoute').render(v);
      debug('VDOM render finished');

      React.render(root, mountNode);
    }
  };
};
