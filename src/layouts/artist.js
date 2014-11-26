var App = require('app/components/app');
var Sidebar = require('app/components/sidebar');
var ArtistProfile = require('app/components/artist-profile');
var TracklistCard = require('app/components/tracklist-card');

function ArtistLayout(attrs) {
  this.name = attrs.name;
}

ArtistLayout.prototype.render = function (appstate) {
  var tracklistCard = new TracklistCard({
    player: appstate.get('player')
  });

  var profile = new ArtistProfile({
    key: 'profile',
    artist: this.name,
    player: appstate.get('player'),
    library: appstate.get('tracks')
  });

  var sidebar = new Sidebar({ key: 'sidebar' }, tracklistCard);

  return new App(null, [profile, sidebar]);
};

module.exports = ArtistLayout;
