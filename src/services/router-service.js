var page = require('page');
var onValue = require('app/fn/onValue');
var LastNWeeksDRange = require('app/values/last-nweeks-drange');

module.exports = function(vbus) {
  page('/', function () {
    vbus.emit({
      tag: [':app/route', ':route/main'],
      groups: [41293763, 32211876, 34110702, 28152291],
      period: new LastNWeeksDRange(32, new Date())
    });
  });

  page('/groups/:id', function (ctx) {
    vbus.emit({
      tag: [':app/route', ':route/group'],
      id: parseInt(ctx.params.id),
      period: new LastNWeeksDRange(32, new Date())
    });
  });

  page('/artist/:name', (ctx) => vbus.emit({ tag: [':app/route', ':route/artist'], name: ctx.params.name }));

  page();
};

