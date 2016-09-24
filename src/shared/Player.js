import { List } from 'immutable';
import omit from 'lodash/omit';
import merge from 'app/shared/merge';
import { hasTag, toggleTag, removeTag, addTag } from 'app/shared/Tag';

export function createPlayer() {
  return {
    ':player/is-empty': true,
    ':player/is-playing': false,
    ':player/position': 0,
    ':player/bytesTotal': 0,
    ':player/bytesLoaded': 0,
    ':player/tracklist': [],
    ':player/seek-to-position': 0,
    ':player/is-seeking': false
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case 'PLAYER_FORWARD': return forward(state, action.ms);
    case 'PLAYER_REWIND': return rewind(state, action.ms);
    case 'PLAYER_PLAY': return play(state);
    case 'PLAYER_TOGGLE_PLAY': return togglePlay(state);
    case 'PLAYER_TOGGLE_TRACK': return togglePlay(state, action.track, action.tracklist);
    case 'PLAYER_UPDATE_POSITION': return updatePosition(state, action.position);
    case 'PLAYER_UPDATE_LOADING': return updateLoadingData(state, action.bytesLoaded, action.bytesTotal);
    case 'PLAYER_NEXT_TRACK': return nextTrack(state);
    case 'PLAYER_FINISH_SEEKING': return finishSeeking(state);
    case 'PLAYER_USE_TRACK': return useTrack(state, action.track);
  }

  return state;
}

export function play(player) {
  return merge(player, {
    ':player/is-playing': true
  });
}

export function pause(player) {
  return merge(player, {
    ':player/is-playing': false
  });
}

export function stop(player) {
  return startSeeking(pause(player), 0);
}

export function togglePlay(player, track, tracklist) {
  if (player[':player/is-empty']) {
    return play(useTracklist(useTrack(player, track), tracklist));
  }

  if (arguments.length === 1) {
    return togglePlayState(player);
  }

  var result = useTrack(player, track);

  if (tracklist !== player[':player/tracklist']) {
    result = useTracklist(result, tracklist);
  }

  if (track.id !== player[':player/track'].id) {
    result = play(result);
  }

  if (track.id === player[':player/track'].id) {
    result = togglePlayState(result);
  }

  return result;
}

export function updatePosition(player, position) {
  return merge(player, {
    ':player/position': position
  });
}

export function updateLoadingData(player, bytesLoaded, bytesTotal) {
  return merge(player, {
    ':player/bytesLoaded': bytesLoaded,
    ':player/bytesTotal': bytesTotal
  });
}

export function useTrack(player, track) {
  return merge(player, {
    ':player/is-empty': false,
    ':player/track': track
  });
}

export function togglePlayState(player) {
  return Object.assign(player, {
    ':player/is-playing': !player[':player/is-playing']
  });
}

export function forward(player, amount) {
  var duration = player[':player/track'].duration * 1000;
  var seekToPosition = player[':player/position'] + amount > duration ? duration : player[':player/position'] + amount;

  return startSeeking(player, seekToPosition);
}

export function rewind(player, amount) {
  var duration = player[':player/track'].duration * 1000;
  var seekToPosition = player[':player/position'] > amount ? player[':player/position'] - amount : 0;

  return startSeeking(player, seekToPosition);
}

export function startSeeking(player, seekToPosition) {
  return merge(player, {
    ':player/is-seeking': true,
    ':player/seek-to-position': seekToPosition
  });
}

export function finishSeeking(player) {
  return merge(player, {
    ':player/is-seeking': false,
    ':player/seek-to-position': 0,
    ':player/position': player[':player/seek-to-position']
  });
}

export function nextTrack(p) {
  if (isLastTrack(p[':player/tracklist'], p[':player/track'])) {
    return stop(p);
  }

  return useTrack(p, nextAfter(p[':player/tracklist'], p[':player/track']));
}

export function useTracklist(p, tracklist) {
  if (p[':player/is-empty'] && tracklist.length > 0) {
    return useTrack(p, tracklist[0]);
  }

  return merge(p, {
    ':player/tracklist': tracklist
  });
}

export function relativePosition(p) {
  if (p[':player/track'].duration === 0) {
    return 0;
  }

  return p[':player/position'] / p[':player/track'].duration / 1000;
}

export function relativeSeekPosition(p) {
  if (p[':player/track'].duration === 0) {
    return 0;
  }

  return p[':player/seek-to-position'] / p.track.duration / 1000;
}

export function relativeLoaded(p) {
  if (p[':player/bytesTotal'] === 0) {
    return 0;
  }

  return p[':player/bytesLoaded'] / p[':player/bytesTotal'];
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
