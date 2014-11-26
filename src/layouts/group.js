var App = require('app/components/app');
var Main = require('app/components/main');
var Sidebar = require('app/components/sidebar');
var GroupProfile = require('app/components/group-profile');
var TracklistCard = require('app/components/tracklist-card');

function GroupLayout(attrs) {
  this.id = parseInt(attrs.id);
}

GroupLayout.prototype.render = function (appstate) {
  var group = appstate.get('groups').findById(this.id);

  var tracklistCard = new TracklistCard({
    player: appstate.get('player')
  });

  var profile = new GroupProfile({
    key: 'profile',
    group: group
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, tracklistCard);

  return new App(null, [profile, sidebar]);
};

module.exports = GroupLayout;
