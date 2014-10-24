var _ = require('underscore');

var App = require('app/components/app');
var Main = require('app/components/main');
var Sidebar = require('app/components/sidebar');
var GroupProfile = require('app/components/group-profile');
var TracklistCard = require('app/components/tracklist-card');
var Group = require('app/models/group');

module.exports = function layoutGroupWithId(id) {
  return function layoutGroupView(appstate) {
    var groups = appstate.get('groups').items.filter(_.negate(Group.isEmpty));
    var group = groups.find(group => group.id === id);

    var tracklistCard = new TracklistCard({
      name: appstate.get('playqueue').source.name,
      activeTrack: appstate.get('activeTrack'),
      tracks: appstate.get('playqueue').items
    });

    var profile = new GroupProfile({
      key: 'profile',
      group: group
    });

    var sidebar = new Sidebar({ key: 'sidebar' }, tracklistCard);

    return new App(null, [profile, sidebar]);
  };
};
