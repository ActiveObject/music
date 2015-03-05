var React = require('react');
var GroupRouteCmp = React.createFactory(require('app/components/group-layout'));
var LastNWeeksDRange = require('app/values/last-nweeks-drange');
var DateRange = require('app/values/date-range');

function GroupRoute(attrs) {
  this.id = parseInt(attrs.id);
  this.period = new LastNWeeksDRange(32, new Date());
}

GroupRoute.fromJSON = function (v) {
  return new GroupRoute(v['router:group-route:id'], DateRange.fromJSON(v['router:group-route:period']));
};

GroupRoute.prototype.toJSON = function () {
  return {
    'router:group-route': {
      'router:group-route:id': this.id,
      'router:group-route:period': this.period.toJSON()
    }
  };
};

GroupRoute.prototype.render = function (appstate) {
  return new GroupRouteCmp({
    id: this.id,
    period: this.period,
    player: appstate.get('player'),
    groups: appstate.get('groups'),
    activities: appstate.get('activities')
  });
};

GroupRoute.prototype.url = function() {
  return '/groups/' + this.id;
};

GroupRoute.prototype.lifecycle = require('app/core/default-route-lifecycle');

module.exports = GroupRoute;
