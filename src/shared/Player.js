import { List } from 'immutable';
import omit from 'lodash/omit';
import merge from 'app/shared/merge';
import { hasTag, toggleTag, removeTag, addTag } from 'app/shared/Tag';

export function createPlayer() {
  return {
    tag: [':app/player', ':player/empty'],
    position: 0,
    bytesTotal: 0,
    bytesLoaded: 0,
    tracklist: []
  };
}

export function play(p) {
  return addTag(p, ':player/is-playing');
}

export function pause(p) {
  return removeTag(p, ':player/is-playing');
}

export function stop(p) {
  return seek(pause(p), 0);
}

export function togglePlay(player, track, tracklist) {
  if (hasTag(player, ':player/empty')) {
    return play(useTrack(player, track));
  }

  if (arguments.length === 1) {
    return togglePlayState(player);
  }

  var result = useTrack(player, track);

  if (tracklist !== player.tracklist) {
    result = useTracklist(result, tracklist);
  }

  if (track.id !== player.track.id) {
    result = play(result);
  }

  if (track.id === player.track.id) {
    result = togglePlayState(result);
  }

  return result;
}

export function useTrack(player, track) {
  return merge(removeTag(player, ':player/empty'), { track: track });
}

export function togglePlayState(p) {
  return toggleTag(p, ':player/is-playing');
}

export function forward(player, amount) {
  var duration = player.track.duration * 1000;
  var seekToPosition = player.position + amount > duration ? duration : player.position + amount;

  return startSeeking(player, seekToPosition);
}

export function rewind(player, amount) {
  var duration = player.track.duration * 1000;
  var seekToPosition = player.position > amount ? player.position - amount : 0;

  return startSeeking(player, seekToPosition);
}

export function startSeeking(player, seekToPosition) {
  return merge(addTag(player, ':player/seek-to-position'), { seekToPosition });
}

export function finishSeeking(player) {
  return merge(omit(removeTag(player, ':player/seek-to-position'), 'seekToPosition'), {
    position: player.seekToPosition
  });
}

export function nextTrack(p) {
  if (isLastTrack(p.tracklist, p.track)) {
    return stop(p);
  }

  return merge(p, {
    track: nextAfter(p.tracklist, p.track)
  });
}

export function useTracklist(p, tracklist) {
  if (hasTag(p, ':player/empty') && tracklist.length > 0) {
    return removeTag(merge(p, { track: tracklist[0] }), ':player/empty');
  }

  return merge(p, { tracklist });
}

export function relativePosition(p) {
  if (p.track.duration === 0) {
    return 0;
  }

  return p.position / p.track.duration / 1000;
}

export function relativeSeekPosition(p) {
  if (p.track.duration === 0) {
    return 0;
  }

  return p.seekPosition / p.track.duration / 1000;
}

export function relativeLoaded(p) {
  if (p.bytesTotal === 0) {
    return 0;
  }

  return p.bytesLoaded / p.bytesTotal;
}

function isLastTrack(tracklist, track) {
  return (activeIndex(tracklist, track) + 1) === tracklist.length;
}

function nextAfter(tracklist, track) {
  return tracklist[activeIndex(tracklist, track) + 1];
}

function activeIndex(tracklist, track) {
  return tracklist.findIndex(t => t.id === track.id);
}
