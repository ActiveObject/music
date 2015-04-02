var page = require('page');
var Atom = require('app/core/atom');
var vbus = require('app/core/vbus');
var router = require('app/core/router');
var layout = require('app/db/layout');

var GroupRoute = require('app/routes/group-route');
var ArtistRoute = require('app/routes/artist-route');
var MainRoute = require('app/routes/main-route');

var LastNWeeksDRange = require('app/values/last-nweeks-drange');

Atom.listen(layout, function (layout) {
  router.transitionTo(layout);

  if (layout.url) {
    window.history.pushState(null, 'TEst', layout.url());
  }
});

page('/', function () {
  var groups = [41293763, 32211876, 34110702, 28152291];
  var period = new LastNWeeksDRange(32, new Date());
  vbus.emit(new MainRoute({ groups: groups, period: period }));
});

page('/groups/:id', (ctx) => vbus.emit(new GroupRoute({ id: ctx.params.id })));
page('/artist/:name', (ctx) => vbus.emit(new ArtistRoute({ name: ctx.params.name })));

page();
