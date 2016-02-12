import { List } from 'immutable';
import merge from 'app/merge';
import { hasTag, toggleTag, removeTag, addTag } from 'app/Tag';
import { shuffle as shuffleArray, omit } from 'underscore';

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
    seekPosition: p.track.audio.duration * position * 1000
  });
}

export function seekTo(p, position) {
  return merge(addTag(p, ':player/seek-to-position'), {
    seekToPosition: p.track.audio.duration * position * 1000
  });
}

export function forward(p, amount) {
  var duration = p.track.audio.duration * 1000;

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
  if (Object.keys(p.track).length === 0 && tracklist.size > 0) {
    return merge(p, { track: tracklist.first() });
  }

  return merge(p, { tracklist: tracklist });
}

export function relativePosition(p) {
  if (p.track.audio.duration === 0) {
    return 0;
  }

  return p.position / p.track.audio.duration / 1000;
}

export function relativeSeekPosition(p) {
  if (p.track.audio.duration === 0) {
    return 0;
  }

  return p.seekPosition / p.track.audio.duration / 1000;
}

export function relativeLoaded(p) {
  if (p.bytesTotal === 0) {
    return 0;
  }

  return p.bytesLoaded / p.bytesTotal;
}

export function toggleShuffle(p, tracklist) {
  if (hasTag(p, ':player/is-shuffled')) {
    return omit(removeTag(p, ':player/is-shuffled'), 'shuffledTracklist');
  }

  var shuffledTracklist = [p.track, ...shuffleArray(tracklist.filter(t => t.trackId !== p.track.id))];

  return merge(addTag(p, ':player/is-shuffled'), {
    shuffledTracklist
  });
}

function isLastTrack(tracklist, track) {
  var activeIndex = tracklist.findIndex(function (t) {
    return t.id === track.id;
  });

  return (activeIndex + 1) === tracklist.length;
}

function nextAfter(tracklist, track) {
  var activeIndex = tracklist.findIndex(function (t) {
    return t.id === track.id;
  });

  return tracklist[activeIndex + 1];
}
