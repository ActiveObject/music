var React = require('react');
var MainRouteCmp = React.createFactory(require('app/ui/main-layout'));
var DateRange = require('app/values/date-range');

function MainRoute(attrs) {
  if (!(this instanceof MainRoute)) {
    return new MainRoute(attrs);
  }

  this.groups = attrs.groups;
  this.period = attrs.period;
}

MainRoute.fromJSON = function (v) {
  return new MainRoute(v);
};

MainRoute.prototype.toJSON = function () {
  return {
    'router:main-route': {
      groups: this.groups,
      period: this.period
    }
  };
};

MainRoute.prototype.tag = function () {
  return 'main-route';
};

MainRoute.prototype.rep = function () {
  return this.toJSON()['router:main-route'];
};

MainRoute.prototype.render = function() {
  return MainRouteCmp({
    key: 'main',
    visibleGroups: this.groups,
    period: this.period
  });
};

MainRoute.prototype.url = function() {
  return '/';
};

MainRoute.prototype.lifecycle = require('app/core/default-route-lifecycle');

module.exports = MainRoute;
