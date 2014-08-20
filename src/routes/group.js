var _ = require('underscore');

var App = require('app/components/app');
var Main = require('app/components/main');
var Sidebar = require('app/components/sidebar');
var ActiveTrack = require('app/components/active-track');
var GroupProfile = require('app/components/group-profile');
var TracklistCard = require('app/components/tracklist-card');

function makeApp(groupId, groups, tracks, activeTrack, cursor) {
  var group = new GroupProfile({
    key: 'group',
    group: _.find(groups.toJS(), function (group) {
      return group.id === groupId;
    })
  });

  var tracklist = new TracklistCard({
    tracks: tracks,
    activeTrack: activeTrack,
    cursor: { activeTrack: cursor },
    name: 'Аудіозаписи'
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, tracklist);

  return new App(null, [group, sidebar]);
}

module.exports = function groupRoute(appstate, ctx) {
  var id = parseInt(ctx.params.id, 10);
  var groups = appstate.get('groups');
  var tracks = appstate.get('tracks');
  var activeTrack = appstate.get('activeTrack');
  var activeTrackCursor = this.cursor('activeTrack');

  return makeApp(id, groups, tracks, activeTrack, activeTrackCursor);
};