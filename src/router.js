var page = require('page');
var layout = require('app/layout');

module.exports = function (receive, send) {
  layout.atom.on('change', function (v) {
    send({ e: 'app', a: ':app/layout', v: v });
  });

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

  receive(':app/started', function(appstate) {
    return appstate.set('layout', layout.atom.value);
  });
};
