var React = require('react');
var debug = require('debug')('app:renderer');
var appstate = require('app/core/db');

module.exports = function (target) {
  return function (receive, send) {

    function render(appstate) {
      var layout = appstate.get('layout');

      debug('layout started');
      var root = layout.render(appstate, send);
      debug('layout finished');

      React.renderComponent(root, target);

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