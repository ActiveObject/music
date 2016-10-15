import React from 'react';
import { connect } from 'react-redux';
import { useTrack } from 'app/actions';
import { hasTag } from 'app/shared/Tag';

class PlayerSync extends React.Component {
  componentWillMount() {
    var cache = localStorage.getItem(':cache/player');

    if (cache) {
      this.props.dispatch(useTrack(JSON.parse(cache)));
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

export default connect(state => ({
  isPlayerEmpty: state[':player/isEmpty'],
  track: state[':player/track'] 
}))(PlayerSync);
