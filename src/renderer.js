var React = require('react');
var debug = require('debug')('app:renderer');
var appstate = require('app/core/appstate');

module.exports = function (mountNode) {
  return function (receive, send) {

    function render(appstate) {
      debug('VDOM render started');
      var root = appstate.get('route').render(appstate, send);
      debug('VDOM render finished');

      React.render(root, mountNode);

      return appstate;
    }

    appstate.atom.on('change', function (value) {
      if (!document.hidden) {
        render(value);
      }
    });

    receive(':app/started', function () {
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
          render(appstate.atom.value);
        }
      }, false);
    });

    return render;
  };
};
