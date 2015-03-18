var React = require('react/addons');
var Immutable = require('immutable');
var Atom = require('app/core/atom');
var Playlist = require('app/values/playlist');
var TrackStore = require('app/stores/track-store');
var AlbumStore = require('app/stores/album-store');
var GenreTracklist = require('app/values/tracklists/genre-tracklist');
var LibraryTracklist = require('app/values/tracklists/library-tracklist');
var PlaylistView = require('app/components/playlist-view');


var UserPlaylists = React.createClass({
  getInitialState: function () {
    return {
      tracks: TrackStore.value,
      albums: AlbumStore.value
    };
  },

  componentWillMount: function () {
    this.unsub1 = Atom.listen(TrackStore, v => this.setState({ tracks: v }));
    this.unsub2 = Atom.listen(AlbumStore, v => this.setState({ albums: v }));
  },

  componentWillUnmount: function () {
    this.unsub1();
    this.unsub2();
  },

  render: function () {
    var allTracks = new LibraryTracklist({
      name: 'All tracks',
      playlist: new Playlist({
        tracks: Immutable.List(),
        isShuffled: false,
        isRepeated: false
      })
    }).update(this.state.tracks);

    var albums = this.state.albums
      .sortBy(v => v.title)
      .map(function (album) {
        return new GenreTracklist({
          genre: album.id,
          name: album.title,
          playlist: new Playlist({
            tracks: Immutable.List(),
            isShuffled: false,
            isRepeated: false
          })
        }).update(this.state.tracks);
      }, this);

    var playlists = [allTracks].concat(albums.toJS()).map(function (tracklist) {
      return <PlaylistView value={tracklist} />;
    }, this);

    return <div>{playlists}</div>;
  }
});

module.exports = UserPlaylists;