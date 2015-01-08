var router = require('app/router');

module.exports = function (receive, send, mount) {
  mount(router);

  receive(':app/started', () => router.start());
};
