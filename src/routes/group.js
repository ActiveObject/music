var _ = require('underscore');

var App = require('app/components/app');
var Main = require('app/components/main');
var Sidebar = require('app/components/sidebar');
var GroupProfile = require('app/components/group-profile');
var ActiveTrack = require('app/components/active-track');
var Tracklist = require('app/components/tracklist');
var TracklistCard = require('app/components/tracklist-card');
var Group = require('app/models/group');

module.exports = function groupRoute(appstate, ctx) {
  var id = parseInt(ctx.params.id, 10);
  var groups = appstate.get('groups').items.filter(_.negate(Group.isEmpty));
  var group = groups.find(group => group.id === id);

  var activeTrack = new ActiveTrack({
    track: appstate.get('activeTrack')
  });

  var tracklist = new Tracklist({
    key: 'tracklist',
    tracks: appstate.get('playqueue').items,
    activeTrack: appstate.get('activeTrack')
  });

  var tracklistCard = new TracklistCard({
    name: appstate.get('playqueue').source.name,
    activeTrack: activeTrack,
    tracklist: tracklist
  });

  var profile = new GroupProfile({
    key: 'profile',
    group: group
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, tracklistCard);

  return new App(null, [profile, sidebar]);
};