import React from 'react';
import { connect } from 'react-redux';
import { updateOn } from 'app/AppHost';
import { useTrack } from 'app/playerActions';
import { hasTag } from 'app/shared/Tag';

class PlayerSync extends React.Component {
  componentWillMount() {
    var cache = localStorage.getItem(':cache/player');

    if (cache) {
      this.props.dispatch(useTrack(JSON.parse(cache)));
    }
  }

  componentDidUpdate() {
    var player = this.props.player;

    if (!hasTag(player, ':player/empty')) {
      localStorage.setItem(':cache/player', JSON.stringify(player.track));
    }
  }

  render() {
    return <div/>;
  }
}

export default connect(state => ({ player: state.player }))(PlayerSync);
