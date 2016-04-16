import React from 'react';
import { Map } from 'immutable';
import app from 'app';
import { updateOn } from 'app/renderer';
import { hasTag } from 'app/Tag';
import TracklistTable from 'app/tracklist/TracklistTable';
import LazyTracklist from 'app/tracklist/LazyTracklist';
import LibrarySync from './LibrarySync';

class LibraryTracklist extends React.Component {
  constructor() {
    super();

    this.state = {
      cache: Map()
    };
  }

  componentWillMount() {
    var cache = localStorage.getItem(':cache/library');
    this.setState({ cache: Map(JSON.parse(cache)) });
  }

  render() {
    var tracks = makeTracks(this.state.cache);

    return (
      <LibrarySync cache={this.state.cache} onSync={(c) => this.updateCache(c)} >
        <TracklistTable>
          <LazyTracklist tracks={tracks} />
        </TracklistTable>
      </LibrarySync>
    );
  }

  updateCache(cache) {
    this.setState({ cache });
    localStorage.setItem(':cache/library', JSON.stringify(cache));
  }
}

function makeTracks(cache) {
  var player = app.value.get(':db/player');
  var tracklist = app.value.get(':db/library');

  if (hasTag(player, ':player/is-shuffled')) {
    tracklist = app.value.get(':db/shuffled-library');
  }

  return tracklist
    .filter(t => cache.has(t.trackId))
    .map(t => cache.get(t.trackId));
}

export default updateOn(LibraryTracklist, ':db/library', db => hasTag(db.get(':db/player'), ':player/is-shuffled'));
