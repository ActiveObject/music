var App = require('app/components/app');
var Main = require('app/components/main');
var Sidebar = require('app/components/sidebar');
var TracklistCard = require('app/components/tracklist-card');
var Q = require('app/query');

module.exports = function layoutMainView(appstate, send) {
  var tracklistCard = new TracklistCard({
    queue: appstate.get('playqueue'),
    activeTrack: appstate.get('activeTrack'),
    send: send
  });

  var main = new Main({
    key: 'main',
    activity: appstate.get('activity'),
    groups: Q.getGroups(appstate),
    send: send
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, tracklistCard);

  return new App(null, [main, sidebar]);
};
