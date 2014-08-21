var _ = require('underscore');

var App = require('app/components/app');
var Main = require('app/components/main');
var Sidebar = require('app/components/sidebar');
var GroupProfile = require('app/components/group-profile');
var ActiveTrack = require('app/components/active-track');
var Tracklist = require('app/components/tracklist');
var TracklistCard = require('app/components/tracklist-card');

module.exports = function groupRoute(appstate, ctx) {
  var id = parseInt(ctx.params.id, 10);

  var group = _.find(appstate.get('groups').toJS(), function (group) {
    return group.id === id;
  });

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

  var profile = new GroupProfile({
    key: 'profile',
    group: group
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, tracklistCard);

  return new App(null, [profile, sidebar]);
};