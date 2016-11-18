import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import difference from 'lodash/difference';
import vk from 'app/shared/vk';
import merge from 'app/shared/merge';
import * as Track from 'app/shared/Track';
import { EffectComponent } from 'app/shared/effects';

class LibrarySync extends EffectComponent {
  state = {
    cache: Map()
  }

  componentWillMount() {
    this.setState({
      cache: Map(JSON.parse(localStorage.getItem(':cache/library')))
    });

    this.sync();
  }

  componentDidUpdate() {
    this.sync();
  }

  render() {
    var tracks = this.props.library
      .filter(t => this.state.cache.has(t.trackId))
      .map(t => this.state.cache.get(t.trackId));

    return this.props.children(tracks);
  }

  sync() {
    var { userId, albums, library } = this.props;
    var { cache } = this.state;
    var idsInCache = [...cache.keys()];
    var idsInLibrary = library.map(t => t.trackId)
    var outdated = difference(idsInCache, idsInLibrary);
    var missing = difference(idsInLibrary, idsInCache);
    var itemsToLoad = missing.map(id => ({ owner: userId, id }));

    console.log(`[LibrarySync] ${missing.length} missing, ${outdated.length} outdated`);

    if (itemsToLoad.length > 0) {
      var effect = loadTracksById(itemsToLoad.slice(0, 100), (err, res) => {
        if (err) {
          return console.log(err);
        }

        var tracks = res.response.map(t => Track.fromVk(t, albums));
        var cache = tracks.reduce((c, t) => c.set(t.id, t), this.state.cache)

        this.setState({ cache });
        localStorage.setItem(':cache/library', JSON.stringify(cache));
      });

      this.perform(effect);
    }
  }
}

function loadTracksById(items, callback) {
  return vk.audio.getById({
    audios: items.map(({ owner, id }) => `${owner}_${id}`).join(',')
  }, callback);
}

export default connect(state => ({
  userId: state[':app/userId'],
  albums: state[':app/albums'],
  library: state[':app/library']
}))(LibrarySync);
