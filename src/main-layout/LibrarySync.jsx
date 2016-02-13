import React from 'react';
import app from 'app';
import vk from 'app/vk';
import merge from 'app/merge';
import * as Track from 'app/Track';

class LibrarySync extends React.Component {
  componentWillMount() {
    this.sync();
  }

  componentDidUpdate() {
    this.sync();
  }

  render() {
    return this.props.children;
  }

  sync() {
    var user = app.value.get(':db/user');
    var albums = app.value.get(':db/albums');
    var library = app.value.get(':db/library');
    var missingTracks = library.filter(t => !this.props.cache.has(t.trackId));
    var itemsToLoad = missingTracks.map(t => ({ owner: user.id, id: t.trackId }));

    console.log(`missing tracks: ${missingTracks.length}`);

    if (itemsToLoad.length > 0) {
      loadTracksById(itemsToLoad.slice(0, 100), (err, res) => {
        if (err) {
          return console.log(err);
        }

        var tracks = res.response.map(t => Track.fromVk(t, albums));
        var cache = tracks.reduce((c, t) => c.set(t.id, t), this.props.cache)

        this.props.onSync(cache);
      });
    }
  }
}

function chunkify(items, itemsPerGroup) {
  if (items.length < itemsPerGroup) {
    return [items];
  }

  return [items.slice(0, itemsPerGroup), ...chunkify(items.slice(itemsPerGroup), itemsPerGroup)];
}

function loadTracksById(items, callback) {
  vk.audio.getById({
    audios: items.map(({ owner, id }) => `${owner}_${id}`).join(',')
  }, callback);
}

export default LibrarySync;
