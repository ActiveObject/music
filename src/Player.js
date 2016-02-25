import { List } from 'immutable';
import omit from 'lodash/omit';
import merge from 'app/merge';
import { hasTag, toggleTag, removeTag, addTag } from 'app/Tag';

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

export function seek(p, position) {
  return merge(p, {
    seekPosition: p.track.duration * position * 1000
  });
}

export function seekTo(p, position) {
  return merge(addTag(p, ':player/seek-to-position'), {
    seekToPosition: p.track.duration * position * 1000
  });
}

export function forward(p, amount) {
  var duration = p.track.duration * 1000;

  return merge(addTag(p, ':player/seek-to-position'), {
    seekToPosition: p.position + amount > duration ? duration : p.position + amount
  });
}

export function rewind(p, amount) {
  return merge(addTag(p, ':player/seek-to-position'), {
    seekToPosition: p.position > amount ? p.position - amount : 0
  });
}

export function startSeeking(p) {
  return merge(addTag(p, ':player/seeking'), { seekPosition: p.position });
}

export function stopSeeking(p) {
  return merge(removeTag(p, ':player/seeking'), { position: p.seekPosition });
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
