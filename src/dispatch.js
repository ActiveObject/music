import React from 'react';
import MainLayout from 'app/main-layout/MainLayout';
import AuthView from 'app/auth/AuthView';
import { hasTag } from 'app/Tag';

export default function dispatch(route) {
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
}
