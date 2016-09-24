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

function play(state) {
  return merge(state, {
    ':player/is-playing': true
  });
}

function pause(state) {
  return merge(state, {
    ':player/is-playing': false
  });
}

function stop(state) {
  return startSeeking(pause(state), 0);
}

function togglePlay(state, track, tracklist) {
  if (state[':player/is-empty']) {
    return play(useTracklist(useTrack(state, track), tracklist));
  }

  if (arguments.length === 1) {
    return togglePlayState(state);
  }

  var result = useTrack(state, track);

  if (tracklist !== state[':player/tracklist']) {
    result = useTracklist(result, tracklist);
  }

  if (track.id !== state[':player/track'].id) {
    result = play(result);
  }

  if (track.id === state[':player/track'].id) {
    result = togglePlayState(result);
  }

  return result;
}

function updatePosition(state, position) {
  return merge(state, {
    ':player/position': position
  });
}

function updateLoadingData(state, bytesLoaded, bytesTotal) {
  return merge(state, {
    ':player/bytesLoaded': bytesLoaded,
    ':player/bytesTotal': bytesTotal
  });
}

function useTrack(state, track) {
  return merge(state, {
    ':player/is-empty': false,
    ':player/track': track
  });
}

function togglePlayState(state) {
  return Object.assign(state, {
    ':player/is-playing': !state[':player/is-playing']
  });
}

function forward(state, amount) {
  var duration = state[':player/track'].duration * 1000;
  var seekToPosition = state[':player/position'] + amount > duration ? duration : state[':player/position'] + amount;

  return startSeeking(state, seekToPosition);
}

function rewind(state, amount) {
  var duration = state[':player/track'].duration * 1000;
  var seekToPosition = state[':player/position'] > amount ? state[':player/position'] - amount : 0;

  return startSeeking(state, seekToPosition);
}

function startSeeking(state, seekToPosition) {
  return merge(state, {
    ':player/is-seeking': true,
    ':player/seek-to-position': seekToPosition
  });
}

function finishSeeking(state) {
  return merge(state, {
    ':player/is-seeking': false,
    ':player/seek-to-position': 0,
    ':player/position': state[':player/seek-to-position']
  });
}

function nextTrack(state) {
  if (isLastTrack(state[':player/tracklist'], state[':player/track'])) {
    return stop(state);
  }

  return useTrack(state, nextAfter(state[':player/tracklist'], state[':player/track']));
}

function useTracklist(state, tracklist) {
  if (state[':player/is-empty'] && tracklist.length > 0) {
    return useTrack(state, tracklist[0]);
  }

  return merge(state, {
    ':player/tracklist': tracklist
  });
}

function relativePosition(state) {
  if (state[':player/track'].duration === 0) {
    return 0;
  }

  return state[':player/position'] / state[':player/track'].duration / 1000;
}

function relativeSeekPosition(state) {
  if (state[':player/track'].duration === 0) {
    return 0;
  }

  return state[':player/seek-to-position'] / state.track.duration / 1000;
}

function relativeLoaded(state) {
  if (state[':player/bytesTotal'] === 0) {
    return 0;
  }

  return state[':player/bytesLoaded'] / state[':player/bytesTotal'];
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
