var groups = require('app/values/groups');
var newsfeed = require('app/values/newsfeed');

module.exports = function (receive, send) {
  receive(':app/groups', function(appstate, v) {
    return appstate.set('groups', v);
  });

  receive(':app/started', function(appstate) {
    return appstate.set('groups', groups);
  });

  receive(':vk/wall', function(appstate, data) {
    send({ e: 'app', a: ':app/newsfeed', v: newsfeed.fromVkResponse(data) });
  });

  receive(':app/newsfeed', function(appstate, newsfeed) {
    send({ e: 'app', a: ':app/groups', v: appstate.get('groups').withNewsfeed(newsfeed) });
  });
};
