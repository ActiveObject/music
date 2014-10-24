var App = require('app/components/app');
var Main = require('app/components/main');
var Sidebar = require('app/components/sidebar');
var TracklistCard = require('app/components/tracklist-card');

module.exports = function layoutMainView(appstate) {
  var tracklistCard = new TracklistCard({
    name: appstate.get('playqueue').source.name,
    tracks: appstate.get('playqueue').items,
    activeTrack: appstate.get('activeTrack')
  });

  var main = new Main({
    key: 'main',
    activity: appstate.get('activity'),
    groups: appstate.get('groups').items
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, tracklistCard);

  return new App(null, [main, sidebar]);
};
