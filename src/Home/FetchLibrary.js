import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import LibrarySync from 'app/library/LibrarySync';

class FetchLibrary extends React.Component {
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
    var tracks = makeTracks(this.state.cache, this.props.library);

    return (
      <LibrarySync cache={this.state.cache} onSync={(c) => this.updateCache(c)} >
        {this.props.children(tracks)}
      </LibrarySync>
    );
  }

  updateCache(cache) {
    this.setState({ cache });

    localStorage.setItem(':cache/library', JSON.stringify(cache));
  }
}

function makeTracks(cache, library) {
  return library
    .filter(t => cache.has(t.trackId))
    .map(t => cache.get(t.trackId));
}

export default connect(state => ({
  library: state[':app/library']
}))(FetchLibrary);
