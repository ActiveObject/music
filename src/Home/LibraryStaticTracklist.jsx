import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { hasTag } from 'app/shared/Tag';
import LibrarySync from 'app/library/LibrarySync';
import TracklistTable from 'app/shared/tracklist/TracklistTable';
import TracklistPreview from 'app/shared/tracklist/TracklistPreview';
import StaticTracklist from 'app/shared/tracklist/StaticTracklist';

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
    var tracks = makeTracks(this.state.cache, this.props.player, this.props.library, this.props.shuffledLibrary);

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

function makeTracks(cache, player, library, shuffledLibrary) {
  var tracklist = hasTag(player, ':player/is-shuffled') ? shuffledLibrary : library;

  return tracklist
    .filter(t => cache.has(t.trackId))
    .map(t => cache.get(t.trackId));
}

export default connect(state => ({ player: state.player, library: state.library, shuffledLibrary: state.shuffledLibrary }))(LibraryStaticTracklist);
