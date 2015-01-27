var React = require('react');
var MainRouteCmp = React.createFactory(require('app/components/main-layout.jsx'));
var DateRange = require('app/values/date-range');

function MainRoute(groups, period) {
  this.groups = groups;
  this.period = period;
}

MainRoute.fromJSON = function (v) {
  return new MainRoute(v.groups, DateRange.fromJSON(v.period));
};

MainRoute.prototype.toJSON = function () {
  return {
    'main-route': {
      groups: this.groups,
      period: this.period.toJSON()
    }
  };
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