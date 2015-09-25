var React = require('react');
var MainLayout = require('app/ui/main-layout');
var AuthView = require('app/ui/auth');
var hasTag = require('app/fn/hasTag');

module.exports = function dispatch(route) {
  if (hasTag(route, ':route/main')) {
    return React.createElement(MainLayout, {
      visibleGroups: route.groups,
      period: route.period
    });
  }

  if (hasTag(route, ':route/auth')) {
    return React.createElement(AuthView, {
      url: route.authUrl
    });
  }

  return React.createElement('div', { className: 'empty-view' }, '404');
};
