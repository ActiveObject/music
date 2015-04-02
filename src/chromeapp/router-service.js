var Atom = require('app/core/atom');
var vbus = require('app/core/vbus');
var router = require('app/core/router');

var GroupRoute = require('app/routes/group-route');
var ArtistRoute = require('app/routes/artist-route');
var MainRoute = require('app/routes/main-route');

var LastNWeeksDRange = require('app/values/last-nweeks-drange');

Atom.listen(layout, layout => router.transitionTo(layout));

var groups = [41293763, 32211876, 34110702, 28152291];
var period = new LastNWeeksDRange(32, new Date());

vbus.emit(new MainRoute({ groups: groups, period: period }));
