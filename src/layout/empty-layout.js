var React = require('react');
var MainLayout = require('app/layout/main-layout');
var AuthLayout = require('app/layout/auth-layout');

function EmptyLayout() {

}

EmptyLayout.prototype.render = function(appstate) {
  return React.DOM.div({ className: 'empty-view' });
};

EmptyLayout.prototype.main = function () {
  return MainLayout.create();
};

EmptyLayout.prototype.auth = function (attrs) {
  return AuthLayout.create(attrs);
};

exports.create = function() {
  return new EmptyLayout();
};
