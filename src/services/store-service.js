var ISet = require('immutable').Set;

module.exports = function (receive, send) {
  receive(':app/started', function (appstate) {
    return appstate.set('newsfeeds', ISet());
  });

  receive(':app/started', function (appstate) {
    return appstate.set('activities', ISet());
  });

  receive(':app/started', function (appstate) {
    return appstate.set('groups', ISet());
  });

  receive(':app/started', function(appstate) {
    return appstate.set('tracks', ISet());
  });

  receive(':activity', function(appstate, activity) {
    var changes = activity.subtract(appstate.get('activities')).toJS();

    if (changes.length > 0) {
      send({ e: 'app', a: ':app/activity', v: changes });
    }
  });

  receive(':app/activity', function (appstate, activity) {
    return appstate.update('activities', (v) => v.concat(activity));
  });

  receive(':app/newsfeed', function (appstate, nf) {
    return appstate.update('newsfeeds', (v) => v.add(nf));
  });

  receive(':app/groups', function (appstate, groups) {
    return appstate.update('groups', (v) => v.union(groups));
  });

  receive(':app/tracks', function(appstate, tracks) {
    return appstate.update('tracks', (v) => v.union(tracks));
  });
};
