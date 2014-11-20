var App = require('app/components/app');
var Main = require('app/components/main');
var Sidebar = require('app/components/sidebar');
var TracklistCard = require('app/components/tracklist-card');

module.exports = function layoutMainView(appstate, send) {
  var tracklistCard = new TracklistCard({
    playlist: appstate.get('playlist'),
    player: appstate.get('player')
  });

  var main = new Main({
    key: 'main',
    activity: appstate.get('activity'),
    groups: appstate.get('groups')
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, tracklistCard);

  return new App(null, [main, sidebar]);
};
