import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { hasTag } from 'app/shared/Tag';
import TracklistTable from 'app/shared/tracklist/TracklistTable';
import LazyTracklist from 'app/shared/tracklist/LazyTracklist';
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
    var tracks = makeTracks(this.state.cache, this.props.player, this.props.library, this.props.isShuffled);

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

function makeTracks(cache, player, library, isShuffled) {
  if (hasTag(player, ':player/is-shuffled')) {
    tracklist = isShuffled;
  }

  return tracklist
    .filter(t => cache.has(t.trackId))
    .map(t => cache.get(t.trackId));
}

export default connect(state => ({ player: state.player, library: state.library, isShuffled: state.isShuffled }))(LibraryTracklist);
