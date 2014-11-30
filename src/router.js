var page = require('page');
var Layout = require('app/layouts');

module.exports = function (receive, send) {
  page('/', function () {
    send({ e: 'app/layout', a: ':layout', v: Layout.main });
  });

  page('/groups/:id', function (ctx) {
    send({ e: 'app/layout', a: ':layout', v: Layout.group(ctx.params.id) });
  });

  page('/artist/:name', function (ctx) {
    send({ e: 'app/layout', a: ':layout', v: Layout.artist(ctx.params.name) });
  });

  receive(':app/started', page);
};
