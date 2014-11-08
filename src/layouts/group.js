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
    var group = appstate.get('groups').findById(id);

    var tracklistCard = new TracklistCard({
      queue: appstate.get('playqueue'),
      activeTrack: appstate.get('activeTrack')
    });

    var profile = new GroupProfile({
      key: 'profile',
      group: group
    });

    var sidebar = new Sidebar({ key: 'sidebar' }, tracklistCard);

    return new App(null, [profile, sidebar]);
  };
};
