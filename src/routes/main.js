var App = require('app/components/app');
var Main = require('app/components/main');
var Sidebar = require('app/components/sidebar');
var TracklistCard = require('app/components/tracklist-card');

function makeApp(activity, groups, tracks, activeTrack, cursor) {
  var main = new Main({
    key: 'main',
    activity: activity,
    groups: groups
  });

  var tracklist = new TracklistCard({
    tracks: tracks,
    activeTrack: activeTrack,
    cursor: { activeTrack: cursor },
    name: 'Аудіозаписи'
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, tracklist);

  return new App(null, [main, sidebar]);
}

module.exports = function mainRoute(appstate) {
  var activity = appstate.get('activity');
  var groups = appstate.get('groups');
  var tracks = appstate.get('tracks');
  var activeTrack = appstate.get('activeTrack');
  var activeTrackCursor = this.cursor('activeTrack');

  return makeApp(activity, groups, tracks, activeTrack, activeTrackCursor);
};