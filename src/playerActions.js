export function rewind(ms) {
  return {
    type: 'PLAYER_REWIND',
    ms
  };
}

export function forward(ms) {
  return {
    type: 'PLAYER_FORWARD',
    ms
  };
}

export function togglePlay() {
  return {
    type: 'PLAYER_TOGGLE_PLAY'
  };
}

export function toggleTrack(track, tracklist) {
  return {
    type: 'PLAYER_TOGGLE_TRACK',
    track,
    tracklist
  };
}

export function updatePosition(position) {
  return {
    type: 'PLAYER_UPDATE_POSITION',
    position
  };
}

export function updateLoading(bytesLoaded, bytesTotal) {
  return {
    type: 'PLAYER_UPDATE_LOADING',
    bytesLoaded,
    bytesTotal
  };
}

export function nextTrack() {
  return {
    type: 'PLAYER_NEXT_TRACK'
  };
}

export function finishSeeking() {
  return {
    type: 'PLAYER_FINISH_SEEKING'
  };
}
