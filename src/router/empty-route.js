var React = require('react');
var MainRoute = require('app/router/main-route');
var AuthRoute = require('app/router/auth-route');

function EmptyLayout() {

}

EmptyLayout.prototype.render = function(appstate) {
  return React.DOM.div({ className: 'empty-view' });
};

EmptyLayout.prototype.main = function () {
  return MainRoute.create();
};

EmptyLayout.prototype.auth = function (attrs) {
  return AuthRoute.create(attrs);
};

exports.create = function() {
  return new EmptyLayout();
};
