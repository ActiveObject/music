import React from 'react';
import { Spring } from 'react-motion';
import db from 'app/db';
import hasTag from 'app/fn/hasTag';
import updateOnKey from 'app/fn/updateOnKey';

import IScrollLayer from 'app/ui/iscroll-layer';
import LazyTracklist from 'app/ui/LazyTracklist';

var PlaylistUI = updateOnKey(React.createClass({
  render: function () {
    var isCmdActivated = hasTag(db.value.get(':db/command-palette'), ':cmd/is-activated');
    var cmd = db.value.get(':db/cmd');
    var tracks = this.filterTracks(cmd);

    return (
      <Spring
        defaultValue={{
          zoom: { val: 100 },
          y: { val: 0 }
        }}

        endValue={{
          zoom: { val: isCmdActivated ? 100 : 100 },
          y: { val: isCmdActivated ? 200 : 0 }
        }}>

        {interpolated =>
          <div className='playlist' style={{ transform: `scale(${interpolated.zoom.val / 100}) translate(0, ${interpolated.y.val}px)` }}>
            <div className='playlist__content'>
              <div className='playlist__columns'>
                <div className='track__index'>#</div>
                <div className='track__artist'>artist</div>
                <div className='track__title'>track</div>
                <div className='track__duration'>time</div>
              </div>
              <div className='playlist__table'>
                <LazyTracklist tracks={tracks} />
              </div>
            </div>
            <div className='playlist__paginator'></div>
          </div>
        }
      </Spring>
    )
  },

  filterTracks: function (cmd) {
    if (cmd.indexOf(':artist') === -1) {
      return this.props.tracks;
    }

    var artist = cmd.slice(cmd.indexOf(':artist') + ':artist'.length).trim();

    if (!artist) {
      return this.props.tracks;
    }

    return this.props.tracks.filter(function (track) {
      return track.audio.artist.toLowerCase().indexOf(artist.toLowerCase()) !== -1;
    });
  }
}), [':db/command-palette', ':db/cmd']);

export default PlaylistUI;