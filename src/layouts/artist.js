var App = require('app/components/app');
var Sidebar = require('app/components/sidebar');
var ArtistProfile = require('app/components/artist-profile');
var TracklistCard = require('app/components/tracklist-card');

module.exports = function layoutArtistWithId(name) {
  return function layoutArtistView(appstate, send) {
    var tracklistCard = new TracklistCard({
      player: appstate.get('player')
    });

    var profile = new ArtistProfile({
      key: 'profile',
      artist: name,
      player: appstate.get('player'),
      library: appstate.get('tracks')
    });

    var sidebar = new Sidebar({ key: 'sidebar' }, tracklistCard);

    return new App(null, [profile, sidebar]);
  };
};