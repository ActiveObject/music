var React = require('react');
var MainRouteCmp = React.createFactory(require('app/components/main-layout.jsx'));
var LastNWeeksDRange = require('app/values/last-nweeks-drange');

function MainRoute() {
  this.groups = [41293763, 32211876, 34110702, 28152291];
  this.period = new LastNWeeksDRange(32, new Date());
}

MainRoute.prototype.render = function(appstate) {
  return MainRouteCmp({
    key: 'main',
    player: appstate.get('player'),
    groups: appstate.get('groups'),
    activities: appstate.get('activities'),
    visibleGroups: this.groups,
    period: this.period
  });
};

MainRoute.prototype.lifecycle = require('app/core/default-route-lifecycle');

module.exports = MainRoute;