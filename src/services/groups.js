var groups = require('app/values/groups');

module.exports = function (receive, send) {
  receive(':app/groups', function(appstate, v) {
    return appstate.set('groups', v);
  });

  receive(':app/started', function(appstate) {
    return appstate.set('groups', groups);
  });
};
