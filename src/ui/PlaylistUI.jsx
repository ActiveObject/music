import React from 'react';
import { Spring } from 'react-motion';
import db from 'app/db';
import { hasTag } from 'app/Tag';
import updateOnKey from 'app/fn/updateOnKey';

import IScrollLayer from 'app/ui/iscroll-layer';
import LazyTracklist from 'app/ui/LazyTracklist';

var PlaylistUI = updateOnKey(React.createClass({
  render: function () {
    var ctx = db.value.get(':db/context');
    var isCmdActivated = hasTag(db.value.get(':db/command-palette'), ':cmd/is-activated');
    var tracks = this.tracks(ctx);

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

  tracks: function (ctx) {
    if (hasTag(ctx, ':context/filter-by-artist')) {
      return this.props.tracks.filter(matchByArtist(ctx.filter.value));
    }

    return this.props.tracks;
  }
}), [':db/context', ':db/command-palette']);

function matchByArtist(artist) {
  return function match(track) {
    return track.audio.artist.toLowerCase().indexOf(artist.toLowerCase()) !== -1;
  };
}

export default PlaylistUI;