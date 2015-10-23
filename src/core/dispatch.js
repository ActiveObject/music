var React = require('react');
var MainLayout = require('app/main-layout/MainLayout');
var AuthView = require('app/auth/AuthView');
var { hasTag } = require('app/Tag');

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
