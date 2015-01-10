var page = require('page');
var router = require('app/core/router');

var GroupRoute = require('app/routes/group-route');
var ArtistRoute = require('app/routes/artist-route');
var MainRoute = require('app/routes/main-route');

module.exports = function (receive, send, mount) {
  mount(router);

  page('/', () => router.transitionTo(new MainRoute()));
  page('/groups/:id', (ctx) => router.transitionTo(new GroupRoute({ id: ctx.params.id })));
  page('/artist/:name', (ctx) => router.transitionTo(new ArtistRoute({ name: ctx.params.name })));

  receive(':app/started', page);
};
