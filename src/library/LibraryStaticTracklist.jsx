import React from 'react';
import { Map } from 'immutable';
import app from 'app';
import { hasTag } from 'app/Tag';
import { updateOn } from 'app/renderer';
import * as Storage from 'app/Storage';
import LibrarySync from './LibrarySync';
import TracklistTable from 'app/tracklist/TracklistTable';
import TracklistPreview from 'app/tracklist/TracklistPreview';
import StaticTracklist from 'app/tracklist/StaticTracklist';

let Tracklist = ({ tracks }) => {
  if (tracks.length === 0) {
    return <TracklistPreview numOfItems={10} />;
  } else {
    return <StaticTracklist tracks={tracks} limit={10} />;
  }
}

class LibraryStaticTracklist extends React.Component {
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
    var tracks = makeTracks(this.state.cache);

    return (
      <LibrarySync cache={this.state.cache} onSync={(c) => this.updateCache(c)} >
        <TracklistTable>
          <Tracklist tracks={tracks} />
        </TracklistTable>
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

export default updateOn(LibraryStaticTracklist, ':db/library', db => hasTag(db.get(':db/player'), ':player/is-shuffled'));
