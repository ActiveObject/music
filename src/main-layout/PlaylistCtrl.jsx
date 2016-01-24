import React from 'react';
import { Motion, spring } from 'react-motion';
import app from 'app';
import { updateOn } from 'app/renderer';
import { hasTag } from 'app/Tag';
import TracklistTable from 'app/tracklist/TracklistTable';
import LazyTracklist from 'app/tracklist/LazyTracklist';

const AnimationContainer = ({ children }) => {
  var isCmdActivated = hasTag(app.value.get(':db/command-palette'), ':cmd/is-activated');

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
        <div className='main-layout' style={{ transform: `scale(${interpolated.zoom / 100}) translate(0, ${interpolated.y}px)`, opacity: `${interpolated.opacity / 100}` }}>
          {children}
        </div>
      }
    </Motion>
  );
}

const PlaylistCtrl = () => {
  var player = app.value.get(':db/player');
  var ctx = app.value.get(':db/context');

  return (
    <AnimationContainer>
      <TracklistTable>
        <LazyTracklist tracks={filterTracksWithGivenCtx(player.tracklist, ctx)} />
      </TracklistTable>
    </AnimationContainer>
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

export default updateOn(PlaylistCtrl, ':db/context', dbVal => dbVal.get(':db/player').tracklist);
