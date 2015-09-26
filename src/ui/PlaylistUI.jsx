import React from 'react';
import { Spring } from 'react-motion';
import vbus from 'app/core/vbus';
import * as Player from 'app/values/player';
import Track from 'app/ui/track';
import IScrollLayer from 'app/ui/iscroll-layer';
import hasTag from 'app/fn/hasTag';
import updateOnKey from 'app/fn/updateOnKey'

var PlaylistUI = React.createClass({
  getInitialState: function () {
    return {
      command: this.props.name,
      opened: false
    };
  },

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
      <Spring
        defaultValue={{
          zoom: { val: 100 },
          y: { val: 0 },
          fontSize: { val: 2 },
          iy: { val: 0 }
        }}

        endValue={{
          zoom: { val: this.state.opened ? 80 : 100 },
          y: { val: this.state.opened ? 500 : 0 },
          fontSize: { val: this.state.opened ? 3 : 2 },
          iy: { val: this.state.opened ? 300 : 0 }
        }}>

        {interpolated =>
          <div className='playlist'>
            <div className='playlist__header'>
              <input
                type='text'
                className='command-palette'
                value={this.state.command}
                onChange={this.executeCommand}
                style={{
                  transform: `translate(0, ${interpolated.iy.val}px)`,
                  fontSize: `${interpolated.fontSize.val}rem`
                }}
                onFocus={() => this.setState({ opened: true })}
                onBlur={() => this.setState({ opened: false })} />
            </div>
            <div className='playlist__content' style={{ transform: `scale(${interpolated.zoom.val / 100}) translate(0, ${interpolated.y.val}px)`}}>
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
        }
      </Spring>
    )
  },

  togglePlay: function (track) {
    vbus.emit(Player.togglePlay(db.value.get(':db/player'), track));
  },

  executeCommand: function (e) {
    this.setState({ command: e.target.value });
  }
});

export default updateOnKey(PlaylistUI, ':db/player')