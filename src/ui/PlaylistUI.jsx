import React from 'react';
import db from 'app/db';
import vbus from 'app/core/vbus';
import * as Player from 'app/values/player';
import Track from 'app/ui/track';
import IScrollLayer from 'app/ui/iscroll-layer';
import hasTag from 'app/fn/hasTag';
import updateOnKey from 'app/fn/updateOnKey';

var PlaylistUI = React.createClass({
  render: function () {
    var player = db.value.get(':db/player');
    var rows = this.props.tracks.slice(0, 100).map(function (track) {
      var isActive = track.id === player.track.id;
      var isPlaying = isActive && hasTag(player, ':player/is-playing');

      return <Track
        track={track}
        isPlaying={isPlaying}
        isActive={isActive}
        onTogglePlay={this.togglePlay}
      />
    }, this);

    return (
      <div className='playlist' style={{ transform: `scale(${this.props.zoom / 100}) translate(0, ${this.props.y}px)`}}>
        <div className='playlist__content'>
          <div className='playlist__columns'>
            <div className='track__index'>#</div>
            <div className='track__artist'>artist</div>
            <div className='track__title'>track</div>
            <div className='track__duration'>time</div>
          </div>
          <div className='playlist__table'>
            <IScrollLayer>{rows}</IScrollLayer>
          </div>
        </div>
        <div className='playlist__paginator'></div>
      </div>
    )
  },

  togglePlay: function (track) {
    vbus.emit(Player.togglePlay(db.value.get(':db/player'), track));
  }
});

export default updateOnKey(PlaylistUI, ':db/player')