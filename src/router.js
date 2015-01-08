var layout = require('app/layout');

module.exports = function (receive, send, mount) {
  mount(layout);

  receive(':app/started', function() {
    layout.start();
  });
};
