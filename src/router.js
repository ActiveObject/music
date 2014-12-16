var page = require('page');
var layout = require('app/layout');

module.exports = function (receive, send, watch, mount) {
  mount(layout);

  page('/', function () {
    layout.main();
  });

  page('/groups/:id', function (ctx) {
    layout.group(ctx.params.id);
  });

  page('/artist/:name', function (ctx) {
    layout.artist(ctx.params.name);
  });

  receive(':app/started', page);
};
