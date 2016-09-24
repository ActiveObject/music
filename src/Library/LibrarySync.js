import React from 'react';
import { connect } from 'react-redux';
import difference from 'lodash/difference';
import vk from 'app/shared/vk';
import merge from 'app/shared/merge';
import * as Track from 'app/shared/Track';

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
    var { userId, albums, library, cache } = this.props;
    var idsInCache = [...cache.keys()];
    var idsInLibrary = library.map(t => t.trackId)
    var outdated = difference(idsInCache, idsInLibrary);
    var missing = difference(idsInLibrary, idsInCache);
    var itemsToLoad = missing.map(id => ({ owner: userId, id }));

    console.log(`[LibrarySync] ${missing.length} missing, ${outdated.length} outdated`);

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

LibrarySync.propTypes = {
  cache: React.PropTypes.object.isRequired,
  onSync: React.PropTypes.func.isRequired
};

function loadTracksById(items, callback) {
  vk.audio.getById({
    audios: items.map(({ owner, id }) => `${owner}_${id}`).join(',')
  }, callback);
}

export default connect(state => ({
  userId: state[':app/user'],
  albums: state[':app/albums'],
  library: state[':app/library']
}))(LibrarySync);
