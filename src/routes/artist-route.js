var React = require('react');
var App = React.createFactory(require('app/components/app.jsx'));
var Box = React.createFactory(require('app/components/box.jsx'));
var ArtistProfile = React.createFactory(require('app/components/artist-profile'));
var LazyTracklist = React.createFactory(require('app/components/lazy-tracklist'));
var Player = React.createFactory(require('app/components/player'));

var ArtistTracklist = require('app/values/tracklists/artist-tracklist');
var Playlist = require('app/values/playlist');

function ArtistRoute(attrs) {
  this.name = attrs.name;
}

ArtistRoute.prototype.render = function (appstate) {
  var tracklist = new LazyTracklist({
    player: appstate.get('player'),
    tracklist: appstate.get('player').visibleTracklist()
  });

  var tracks = appstate.get('tracks').filter((track) => track.artist === this.name);

  var profile = new ArtistProfile({
    artist: this.name,
    player: appstate.get('player'),
    tracklist: new ArtistTracklist({
      artist: this.name,
      playlist: new Playlist({ tracks: tracks })
    })
  });

  var player = new Player({ player: appstate.get('player') });

  var regionA = new Box({ prefix: 'ra-', key: 'region-a' }, profile);
  var regionB = new Box({ prefix: 'rb-', key: 'region-b' }, tracklist);
  var regionC = new Box({ prefix: 'rc-', key: 'region-c' }, player);

  return new App({ layout: ['two-region', 'artist-layout'] }, [regionA, regionB, regionC]);
};

ArtistRoute.prototype.lifecycle = require('app/core/default-route-lifecycle');

module.exports = ArtistRoute;
