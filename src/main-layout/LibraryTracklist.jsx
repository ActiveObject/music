import React from 'react';
import { Map } from 'immutable';
import { Motion, spring } from 'react-motion';
import app from 'app';
import { updateOn } from 'app/renderer';
import { hasTag } from 'app/Tag';
import TracklistTable from 'app/tracklist/TracklistTable';
import LazyTracklist from 'app/tracklist/LazyTracklist';
import vk from 'app/vk';
import merge from 'app/merge';
import * as Track from 'app/Track';
import * as Storage from 'app/Storage';

const AnimationContainer = ({ children }) => {
  var isCmdActivated = hasTag(app.value.get(':db/command-palette'), ':cmd/is-activated');

  return (
    <Motion
      defaultStyle={{
        zoom: 100,
        y: 0,
        opacity: 100
      }}

      style={{
        zoom: spring(isCmdActivated ? 80 : 100),
        y: spring(isCmdActivated ? 200 : 0),
        opacity: spring(isCmdActivated ? 0 : 100)
      }}>
      {interpolated =>
        <div className='main-layout' style={{ transform: `scale(${interpolated.zoom / 100}) translate(0, ${interpolated.y}px)`, opacity: `${interpolated.opacity / 100}` }}>
          {children}
        </div>
      }
    </Motion>
  );
}

class LibraryTracklist extends React.Component {
  constructor() {
    super();

    this.state = {
      cache: Map()
    };
  }

  componentWillMount() {
    Storage.getItem(':cache/library', (cache) => {
      this.setState({ cache: Map(JSON.parse(cache)) });
    });
  }

  render() {
    var library = app.value.get(':db/library');
    var cache = this.state.cache;
    var tracks = library
      .filter(t => cache.has(t.trackId))
      .map(t => cache.get(t.trackId));

    return (
      <LibrarySync cache={this.state.cache} onSync={(c) => this.updateCache(c)} >
        <AnimationContainer>
          <TracklistTable>
            <LazyTracklist tracks={tracks} />
          </TracklistTable>
        </AnimationContainer>
      </LibrarySync>
    );
  }

  updateCache(c) {
    this.setState({ cache: c });

    Storage.setItem({
      ':cache/library': JSON.stringify(c)
    });
  }
}

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

export default updateOn(LibraryTracklist, ':db/library');
