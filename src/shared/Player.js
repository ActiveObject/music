import merge from 'app/shared/merge';

export function play(state) {
  return merge(state, {
    ':player/isPlaying': true
  });
}

export function pause(state) {
  return merge(state, {
    ':player/isPlaying': false
  });
}

export function stop(state) {
  return startSeeking(pause(state), 0);
}

export function togglePlay(state, track, tracklist) {
  if (state[':player/isEmpty']) {
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

export function updatePosition(state, position) {
  return merge(state, {
    ':player/position': position
  });
}

export function updateLoadingData(state, bytesLoaded, bytesTotal) {
  return merge(state, {
    ':player/bytesLoaded': bytesLoaded,
    ':player/bytesTotal': bytesTotal
  });
}

export function useTrack(state, track) {
  return merge(state, {
    ':player/isEmpty': false,
    ':player/track': track
  });
}

export function togglePlayState(state) {
  return Object.assign(state, {
    ':player/isPlaying': !state[':player/isPlaying']
  });
}

export function forward(state, amount) {
  var duration = state[':player/track'].duration * 1000;
  var seekToPosition = state[':player/position'] + amount > duration ? duration : state[':player/position'] + amount;

  return startSeeking(state, seekToPosition);
}

export function rewind(state, amount) {
  var duration = state[':player/track'].duration * 1000;
  var seekToPosition = state[':player/position'] > amount ? state[':player/position'] - amount : 0;

  return startSeeking(state, seekToPosition);
}

export function startSeeking(state, seekToPosition) {
  return merge(state, {
    ':player/isSeeking': true,
    ':player/seekToPosition': seekToPosition
  });
}

export function finishSeeking(state) {
  return merge(state, {
    ':player/isSeeking': false,
    ':player/seekToPosition': 0,
    ':player/position': state[':player/seekToPosition']
  });
}

export function nextTrack(state) {
  if (isLastTrack(state[':player/tracklist'], state[':player/track'])) {
    return stop(state);
  }

  return useTrack(state, nextAfter(state[':player/tracklist'], state[':player/track']));
}

function useTracklist(state, tracklist) {
  if (state[':player/isEmpty'] && tracklist.length > 0) {
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

  return state[':player/seekToPosition'] / state.track.duration / 1000;
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
