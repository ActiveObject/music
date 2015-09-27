import React from 'react';
import db from 'app/db';
import vbus from 'app/core/vbus';
import hasTag from 'app/fn/hasTag';
import updateOn from 'app/fn/updateOn';
import * as Player from 'app/values/player';
import Track from 'app/ui/track';

var TrackCtrl = React.createClass({
  render: function () {
    var player = db.value.get(':db/player');
    var isActive = this.props.track.id === player.track.id;
    var isPlaying = isActive && hasTag(player, ':player/is-playing');

    return (
       <Track
          track={this.props.track}
          isActive={isActive}
          isPlaying={isPlaying}
          onTogglePlay={this.togglePlay} />
    );
  },

  togglePlay: function (track) {
    vbus.emit(Player.togglePlay(db.value.get(':db/player'), track));
  }
});

export default updateOn(TrackCtrl, function (db) {
  return db.get(':db/player').track.id;
});
