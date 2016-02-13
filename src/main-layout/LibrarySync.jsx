import React from 'react';
import app from 'app';
import vk from 'app/vk';
import merge from 'app/merge';
import * as Track from 'app/Track';

class LibrarySync extends React.Component {
  constructor() {
    super();
    this.isSyncing = false;
  }

  componentWillMount() {
    if (!this.isSyncing) {
      this.sync();
    }
  }

  componentDidUpdate() {
    if (!this.isSyncing) {
      this.sync();
    }
  }

  render() {
    return this.props.children;
  }

  sync() {
    var cache = this.props.cache;
    var user = app.value.get(':db/user');
    var albums = app.value.get(':db/albums');
    var library = app.value.get(':db/library');
    var missingTracks = library.filter(t => !cache.has(t.trackId));
    var itemsToLoad = missingTracks.map(t => ({ owner: user.id, id: t.trackId }));

    console.log('missing tracks', missingTracks.map(t => t.trackId));

    if (missingTracks.length > 0) {
      this.isSyncing = true;

      chunkify(itemsToLoad, 100).forEach((itemsGroup, i, groups) => {
        loadTracksById(itemsGroup, (err, res) => {
          if (err) {
            return console.log(err);
          }

          var tracks = res.response.map(data => {
            return merge(data, {
              index: library.findIndex(t => t.trackId === String(data.id))
            });
          }).map(t => Track.fromVk(t, albums))

          cache = tracks.reduce((c, t) => c.set(t.id, t), cache);

          this.props.onSync(cache);

          if (i === groups.length - 1) {
            this.isSyncing = false;
          }
        });
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
