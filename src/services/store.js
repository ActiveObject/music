var ISet = require('immutable').Set;

module.exports = function (receive) {
  receive(':app/started', function (appstate) {
    return appstate.set('newsfeeds', ISet());
  });

  receive(':app/started', function(appstate) {
    return appstate.set('activities', ISet());
  });

  receive(':app/activity', function (appstate, activity) {
    return appstate.update('activities', (v) => v.add(activity));
  });

  receive(':app/newsfeed', function (appstate, nf) {
    return appstate.update('newsfeeds', (v) => v.add(nf));
  });
};
