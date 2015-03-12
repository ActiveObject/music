var React = require('react');
var MainRouteCmp = React.createFactory(require('app/components/main-layout'));
var DateRange = require('app/values/date-range');

function MainRoute(groups, period) {
  this.groups = groups;
  this.period = period;
}

MainRoute.fromJSON = function (v) {
  return new MainRoute(v['router:main-route:groups'], DateRange.fromJSON(v['router:main-route:period']));
};

MainRoute.fromTransit = function (v) {
  return MainRoute.fromJSON(v);
};

MainRoute.prototype.toJSON = function () {
  return {
    'router:main-route': {
      'router:main-route:groups': this.groups,
      'router:main-route:period': this.period.toJSON()
    }
  };
};

MainRoute.prototype.transitTag = 'app-value';

MainRoute.prototype.tag = function () {
  return 'main-route';
};

MainRoute.prototype.rep = function () {
  return this.toJSON()['router:main-route'];
};

MainRoute.prototype.render = function(appstate) {
  return MainRouteCmp({
    key: 'main',
    player: appstate.get('player'),
    groups: appstate.get('groups'),
    activities: appstate.get('activities'),
    user: appstate.get('user'),
    visibleGroups: this.groups,
    period: this.period
  });
};

MainRoute.prototype.lifecycle = require('app/core/default-route-lifecycle');

module.exports = MainRoute;
