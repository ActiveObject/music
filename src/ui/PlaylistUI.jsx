import React from 'react';
import { Motion, spring } from 'react-motion';
import db from 'app/db';
import { hasTag } from 'app/Tag';
import updateOnKey from 'app/fn/updateOnKey';

import IScrollLayer from 'app/ui/iscroll-layer';
import LazyTracklist from 'app/ui/LazyTracklist';

function PlaylistUI({ tracks }) {
  var ctx = db.value.get(':db/context');
  var isCmdActivated = hasTag(db.value.get(':db/command-palette'), ':cmd/is-activated');

  return (
    <Motion
      defaultStyle={{
        zoom: 100,
        y: 0,
        opacity: 100
      }}

      style={{
        zoom: spring(isCmdActivated ? 80 : 100),
        y: spring(isCmdActivated ? 200 : 0),
        opacity: spring(isCmdActivated ? 0 : 100)
      }}>
      {interpolated =>
        <div className='playlist' style={{ transform: `scale(${interpolated.zoom / 100}) translate(0, ${interpolated.y}px)`, opacity: `${interpolated.opacity / 100}` }}>
          <div className='playlist__content'>
            <div className='playlist__columns'>
              <div className='track__index'>#</div>
              <div className='track__artist'>artist</div>
              <div className='track__title'>track</div>
              <div className='track__duration'>time</div>
            </div>
            <div className='playlist__table'>
              <LazyTracklist tracks={filterTracksWithGivenCtx(tracks, ctx)} />
            </div>
          </div>
          <div className='playlist__paginator'></div>
        </div>
      }
    </Motion>
  );
}

function filterTracksWithGivenCtx(tracks, ctx) {
  if (hasTag(ctx, ':context/filter-by-artist')) {
    return tracks.filter(matchByArtist(ctx.filter.value));
  }

  if (hasTag(ctx, ':context/filter-by-tag')) {
    return tracks.filter(matchByTag(ctx.filter.value));
  }

  if (hasTag(ctx, ':context/filter-by-track')) {
    return tracks.filter(matchByTrackTitle(ctx.filter.value));
  }

  return tracks;
}

function matchByArtist(artist) {
  return function match(track) {
    return track.audio.artist.toLowerCase().indexOf(artist.toLowerCase()) !== -1;
  };
}

function matchByTag(tag) {
  return function match(track) {
    return track.audioTags.some(function (audioTag) {
      return audioTag.toLowerCase().includes(tag.toLowerCase());
    });
  };
}

function matchByTrackTitle(title) {
  return function match(track) {
    return track.audio.title.toLowerCase().indexOf(title.toLowerCase()) !== -1;
  };
}

export default updateOnKey(PlaylistUI, [':db/context', ':db/command-palette']);
