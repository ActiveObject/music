export function authenticate(userId, accessToken) {
  return {
    type: 'AUTHENTICATE',
    userId,
    accessToken
  };
}

export function pushGroups(groups) {
  return {
    type: 'GROUPS_PUSH',
    groups
  };
}

export function pushLibrary(library) {
  return {
    type: 'LIBRARY_PUSH',
    library
  };
}

export function pushAlbums(albums) {
  return {
    type: 'LIBRARY_PUSH',
    albums
  };
}

export function toggleShuffle() {
  return {
    type: 'LIBRARY_TOGGLE_SHUFFLE'
  };
}

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

export function play() {
  return {
    type: 'PLAYER_PLAY'
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

export function useTrack(track) {
  return {
    type: 'PLAYER_USE_TRACK',
    track
  };
}
