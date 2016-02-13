import React from 'react';
import app from 'app';
import { updateOn } from 'app/renderer';
import { getItem, setItem } from 'app/Storage';
import { useTrack } from 'app/Player';
import { hasTag } from 'app/Tag';

class PlayerSync extends React.Component {
  componentWillMount() {
    getItem(':cache/player', (cache) => {
      app.push(useTrack(app.value.get(':db/player'), JSON.parse(cache)));
    });
  }

  componentDidUpdate() {
    var player = app.value.get(':db/player');

    if (!hasTag(player, ':player/empty')) {
      setItem({
        ':cache/player': JSON.stringify(player.track)
      });
    }
  }

  render() {
    return <div/>;
  }
}

export default updateOn(PlayerSync, db => db.get(':db/player').track);
