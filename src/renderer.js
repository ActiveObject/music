var React = require('react');
var debug = require('debug')('app:renderer');

module.exports = function (mountNode) {
  return function renderAppstate(appstate) {
    if (!document.hidden) {
      debug('VDOM render started');
      var root = appstate.get('activeRoute').render(appstate);
      debug('VDOM render finished');

      React.render(root, mountNode);
    }
  };
};
