import React from 'react';
import { Map } from 'immutable';
import app from 'app';
import { hasTag } from 'app/Tag';
import { updateOn } from 'app/renderer';
import LibrarySync from 'app/library/LibrarySync';
import TracklistTable from 'app/tracklist/TracklistTable';
import TracklistPreview from 'app/tracklist/TracklistPreview';
import StaticTracklist from 'app/tracklist/StaticTracklist';

class LibraryStaticTracklist extends React.Component {
  constructor() {
    super();

    this.state = {
      cache: Map()
    };
  }

  componentWillMount() {
    this.setState({
      cache: Map(JSON.parse(localStorage.getItem(':cache/library')))
    });
  }

  render() {
    var tracks = makeTracks(this.state.cache);

    return (
      <LibrarySync cache={this.state.cache} onSync={(c) => this.updateCache(c)} >
        <TracklistTable>
          <TracklistPreview isActive={tracks.length === 0} numOfItems={10}>
            <StaticTracklist tracks={tracks} limit={10} />
          </TracklistPreview>
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

export default updateOn(LibraryStaticTracklist, ':db/library', db => hasTag(db.get(':db/player'), ':player/is-shuffled'));
