var React = require('react');
var GroupRouteCmp = React.createFactory(require('app/components/group-layout.jsx'));
var LastNWeeksDRange = require('app/values/last-nweeks-drange');

function GroupRoute(attrs) {
  this.id = parseInt(attrs.id);
  this.period = new LastNWeeksDRange(32, new Date());
}

GroupRoute.prototype.render = function (appstate) {
  return new GroupRouteCmp({
    id: this.id,
    period: this.period,
    player: appstate.get('player'),
    groups: appstate.get('groups'),
    activities: appstate.get('activities')
  });
};

GroupRoute.prototype.lifecycle = require('app/router/default-route-lifecycle');

module.exports = GroupRoute;
