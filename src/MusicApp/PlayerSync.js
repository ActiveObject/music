import React from 'react';

class PlayerSync extends React.Component {
  componentWillMount() {
    var cache = localStorage.getItem(':cache/player');

    if (cache) {
      this.props.onTrackChange(JSON.parse(cache));
    }
  }

  componentDidUpdate() {
    var { isPlayerEmpty, track } = this.props;

    if (!isPlayerEmpty) {
      localStorage.setItem(':cache/player', JSON.stringify(track));
    }
  }

  render() {
    return null;
  }
}

export default PlayerSync;
