export const PLAYER_REWIND = 'PLAYER_REWIND';
export const PLAYER_FORWARD = 'PLAYER_FORWARD';
export const PLAYER_PLAY = 'PLAYER_PLAY';
export const PLAYER_TOGGLE_PLAY = 'PLAYER_TOGGLE_PLAY';

export const PLAYER_TOGGLE_TRACK = 'PLAYER_TOGGLE_TRACK';
export const PLAYER_NEXT_TRACK = 'PLAYER_NEXT_TRACK';
export const PLAYER_PREV_TRACK = 'PLAYER_PREV_TRACK';
export const PLAYER_USE_TRACK = 'PLAYER_USE_TRACK';

export function rewind(ms) {
  return {
    type: PLAYER_REWIND,
    ms
  };
}

export function forward(ms) {
  return {
    type: PLAYER_FORWARD,
    ms
  };
}

export function play() {
  return {
    type: PLAYER_PLAY
  };
}

export function togglePlay() {
  return {
    type: PLAYER_TOGGLE_PLAY
  };
}

export function toggleTrack(track, playlist) {
  return {
    type: PLAYER_TOGGLE_TRACK,
    track,
    playlist
  };
}

export function nextTrack() {
  return {
    type: PLAYER_NEXT_TRACK
  };
}

export function prevTrack() {
  return {
    type: PLAYER_PREV_TRACK
  };
}

export function useTrack(track) {
  return {
    type: PLAYER_USE_TRACK,
    track
  };
}
