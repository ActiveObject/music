var React = require('react');
var GroupRouteCmp = React.createFactory(require('app/components/group-layout'));
var LastNWeeksDRange = require('app/values/last-nweeks-drange');
var DateRange = require('app/values/date-range');

function GroupRoute(attrs) {
  if (!(this instanceof GroupRoute)) {
    return new GroupRoute(attrs);
  }

  this.id = parseInt(attrs.id);
  this.period = new LastNWeeksDRange(32, new Date());
}

GroupRoute.fromJSON = function (v) {
  return new GroupRoute(v);
};

GroupRoute.prototype.toJSON = function () {
  return {
    'router:group-route': {
      id: this.id,
      period: this.period
    }
  };
};

GroupRoute.prototype.tag = function () {
  return 'group-route';
};

GroupRoute.prototype.rep = function () {
  return this.toJSON()['router:group-route'];
};

GroupRoute.prototype.render = function (appstate) {
  return new GroupRouteCmp({
    id: this.id,
    period: this.period
  });
};

GroupRoute.prototype.url = function() {
  return '/groups/' + this.id;
};

GroupRoute.prototype.lifecycle = require('app/core/default-route-lifecycle');

module.exports = GroupRoute;
