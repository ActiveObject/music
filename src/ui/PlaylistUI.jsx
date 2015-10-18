import React from 'react';
import db from 'app/db';
import { hasTag } from 'app/Tag';
import updateOnKey from 'app/fn/updateOnKey';

import LazyTracklist from 'app/ui/LazyTracklist';

function PlaylistUI({ tracks }) {
  var ctx = db.value.get(':db/context');

  return (
    <div className='playlist'>
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

export default updateOnKey(PlaylistUI, ':db/context');
