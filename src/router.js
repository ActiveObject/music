var page = require('page');
var layout = require('app/layout');

module.exports = function (receive, send, mount) {
  mount(layout);

  page('/', () => layout.main());
  page('/groups/:id', (ctx) => layout.group(ctx.params.id));
  page('/artist/:name', (ctx) => layout.artist(ctx.params.name));

  receive(':app/started', page);
};
