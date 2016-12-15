export const AUDIO_REWIND = 'AUDIO_REWIND';
export const AUDIO_FORWARD = 'AUDIO_FORWARD';
export const AUDIO_PLAY = 'AUDIO_PLAY';
export const AUDIO_TOGGLE_PLAY = 'AUDIO_TOGGLE_PLAY';
export const AUDIO_VOLUME_UP = 'AUDIO_VOLUME_UP';
export const AUDIO_VOLUME_DOWN = 'AUDIO_VOLUME_DOWN';
export const AUDIO_SEEK_TO = 'AUDIO_SEEK_TO';

export const PLAYER_TOGGLE_TRACK = 'PLAYER_TOGGLE_TRACK';
export const PLAYER_NEXT_TRACK = 'PLAYER_NEXT_TRACK';
export const PLAYER_PREV_TRACK = 'PLAYER_PREV_TRACK';
export const PLAYER_USE_TRACK = 'PLAYER_USE_TRACK';

export function rewind(ms) {
  return {
    type: AUDIO_REWIND,
    ms
  };
}

export function forward(ms) {
  return {
    type: AUDIO_FORWARD,
    ms
  };
}

export function play() {
  return {
    type: AUDIO_PLAY
  };
}

export function togglePlay() {
  return {
    type: AUDIO_TOGGLE_PLAY
  };
}

export function volumeUp() {
  return {
    type: AUDIO_VOLUME_UP
  };
}

export function volumeDown() {
  return {
    type: AUDIO_VOLUME_DOWN
  };
}

export function seekTo(position) {
  return {
    type: AUDIO_SEEK_TO,
    position
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
