var React = require('react');
var debug = require('debug')('app:renderer');
var appstate = require('app/core/appstate');

module.exports = function (mountNode) {
  return function (receive, send) {

    function render(appstate) {
      debug('layout started');
      var root = appstate.get('layout').render(appstate, send);
      debug('layout finished');

      React.renderComponent(root, mountNode);

      return appstate;
    }

    appstate.on('change', function (value) {
      if (!document.hidden) {
        window.requestAnimationFrame(function () {
          render(value);
        });
      }
    });

    receive(':app/started', function () {
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
          render(appstate.value);
        }
      }, false);
    });

    return render;
  };
};
