var ISet = require('immutable').Set;

module.exports = function (receive) {
  receive(':app/started', (appstate) => appstate.set('newsfeeds', ISet()));
  receive(':app/started', (appstate) => appstate.set('activities', ISet()));
  receive(':app/started', (appstate) => appstate.set('groups', ISet()));
  receive(':app/started', (appstate) => appstate.set('tracks', ISet()));

  receive(':app/activity', function (appstate, activity) {
    return appstate.update('activities', (v) => v.union(activity));
  });

  receive(':app/newsfeed', function (appstate, nf) {
    return appstate.update('newsfeeds', (v) => v.add(nf));
  });

  receive(':app/groups', function (appstate, v) {
    return appstate.set('groups', v);
  });

  receive(':app/tracks', function (appstate, v) {
    return appstate.set('tracks', v);
  });

  receive(':app/user', function (appstate, user) {
    return appstate.set('user', user);
  });
};
