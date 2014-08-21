var App = require('app/components/app');
var Main = require('app/components/main');
var Sidebar = require('app/components/sidebar');
var ActiveTrack = require('app/components/active-track');
var Tracklist = require('app/components/tracklist');
var TracklistCard = require('app/components/tracklist-card');

module.exports = function mainRoute(appstate) {
  var activeTrack = new ActiveTrack({
    track: appstate.get('activeTrack')
  });

  var tracklist = new Tracklist({
    key: 'tracklist',
    tracks: appstate.get('tracks'),
    activeTrack: appstate.get('activeTrack')
  });

  var tracklistCard = new TracklistCard({
    name: 'Аудіозаписи',
    activeTrack: activeTrack,
    tracklist: tracklist
  });

  var main = new Main({
    key: 'main',
    activity: appstate.get('activity'),
    groups: appstate.get('groups')
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, tracklistCard);

  return new App(null, [main, sidebar]);
};
