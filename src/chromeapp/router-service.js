var page = require('page');
var router = require('app/core/router');

var GroupRoute = require('app/routes/group-route');
var ArtistRoute = require('app/routes/artist-route');
var MainRoute = require('app/routes/main-route');

var LastNWeeksDRange = require('app/values/last-nweeks-drange');

module.exports = function (receive, mount) {
  mount(router);

  receive(':app/started', function (appstate) {
    var groups = [41293763, 32211876, 34110702, 28152291];
    var period = new LastNWeeksDRange(32, new Date());
    var route = new MainRoute({ groups: groups, period: period });

    router.transitionTo(route);
  });
};
