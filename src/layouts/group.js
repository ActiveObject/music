var _ = require('underscore');

var App = require('app/components/app');
var Main = require('app/components/main');
var Sidebar = require('app/components/sidebar');
var GroupProfile = require('app/components/group-profile');
var TracklistCard = require('app/components/tracklist-card');
var isEmpty = require('app/utils').isEmpty;
var Q = require('app/query');

module.exports = function layoutGroupWithId(id) {
  return function layoutGroupView(appstate, send) {
    var groups = appstate.get('groups').items.filter(_.negate(isEmpty));
    var group = groups.find(group => group.id === id);

    var tracklistCard = new TracklistCard({
      queue: appstate.get('playqueue'),
      activeTrack: appstate.get('activeTrack'),
      send: send
    });

    var profile = new GroupProfile({
      key: 'profile',
      group: group
    });

    var sidebar = new Sidebar({ key: 'sidebar' }, tracklistCard);

    return new App(null, [profile, sidebar]);
  };
};
