import React from 'react';
import app from 'app';
import { updateOn } from 'app/StartApp';
import { useTrack } from 'app/Player';
import { hasTag } from 'app/Tag';

class PlayerSync extends React.Component {
  componentWillMount() {
    var cache = localStorage.getItem(':cache/player');

    if (cache) {
      app.push(useTrack(app.value.get(':db/player'), JSON.parse(cache)));
    }
  }

  componentDidUpdate() {
    var player = app.value.get(':db/player');

    if (!hasTag(player, ':player/empty')) {
      localStorage.setItem(':cache/player', JSON.stringify(player.track));
    }
  }

  render() {
    return <div/>;
  }
}

export default updateOn(PlayerSync, db => db.get(':db/player').track);
