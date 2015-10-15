import React from 'react';
import { Motion, spring } from 'react-motion';
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
      <Motion
        defaultStyle={{ zoom: 100, y: 0 }}
        style={{ zoom: spring(isCmdActivated ? 100 : 100), y: spring(isCmdActivated ? 200 : 0) }}>
        {interpolated =>
          <div className='playlist' style={{ transform: `scale(${interpolated.zoom / 100}) translate(0, ${interpolated.y}px)` }}>
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
      </Motion>
    )
  },

  tracks: function (ctx) {
    if (hasTag(ctx, ':context/filter-by-artist')) {
      return this.props.tracks.filter(matchByArtist(ctx.filter.value));
    }

    if (hasTag(ctx, ':context/filter-by-tag')) {
      return this.props.tracks.filter(matchByTag(ctx.filter.value, ctx.filter.tags));
    }

    if (hasTag(ctx, ':context/filter-by-track')) {
      return this.props.tracks.filter(matchByTrackTitle(ctx.filter.value));
    }

    return this.props.tracks;
  }
}), [':db/context', ':db/command-palette']);

function matchByArtist(artist) {
  return function match(track) {
    return track.audio.artist.toLowerCase().indexOf(artist.toLowerCase()) !== -1;
  };
}

function matchByTag(albumName, tags) {
  var ids = tags
    .filter(function (album) {
      return album.title.toLowerCase().indexOf(albumName.toLowerCase()) !== -1;
    })
    .map(v => v.id);

  return function match(track) {
    return ids.includes(track.album);
  };
}

function matchByTrackTitle(title) {
  return function match(track) {
    return track.audio.title.toLowerCase().indexOf(title.toLowerCase()) !== -1;
  };
}


export default PlaylistUI;