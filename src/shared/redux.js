import { Map } from 'immutable';
import * as Player from './Player';

export const AUTHENTICATE = 'AUTHENTICATE';
export const GROUPS_PUSH = 'GROUPS_PUSH';
export const LIBRARY_PUSH = 'LIBRARY_PUSH';
export const ALBUMS_PUSH = 'ALBUMS_PUSH';
export const LIBRARY_TOGGLE_SHUFFLE = 'LIBRARY_TOGGLE_SHUFFLE';
export const PLAYER_REWIND = 'PLAYER_REWIND';
export const PLAYER_FORWARD = 'PLAYER_FORWARD';
export const PLAYER_PLAY = 'PLAYER_PLAY';
export const PLAYER_TOGGLE_PLAY = 'PLAYER_TOGGLE_PLAY';
export const PLAYER_TOGGLE_TRACK = 'PLAYER_TOGGLE_TRACK';
export const PLAYER_UPDATE_POSITION = 'PLAYER_UPDATE_POSITION';
export const PLAYER_UPDATE_LOADING = 'PLAYER_UPDATE_LOADING';
export const PLAYER_NEXT_TRACK = 'PLAYER_NEXT_TRACK';
export const PLAYER_FINISH_SEEKING = 'PLAYER_FINISH_SEEKING';
export const PLAYER_USE_TRACK = 'PLAYER_USE_TRACK';

export function authenticate(userId, accessToken) {
  return {
    type: AUTHENTICATE,
    userId,
    accessToken
  };
}

export function pushGroups(groups) {
  return {
    type: GROUPS_PUSH,
    groups
  };
}

export function pushLibrary(library) {
  return {
    type: LIBRARY_PUSH,
    library
  };
}

export function pushAlbums(albums) {
  return {
    type: ALBUMS_PUSH,
    albums
  };
}

export function toggleShuffle() {
  return {
    type: LIBRARY_TOGGLE_SHUFFLE
  };
}

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

export function toggleTrack(track, tracklist) {
  return {
    type: PLAYER_TOGGLE_TRACK,
    track,
    tracklist
  };
}

export function updatePosition(position) {
  return {
    type: PLAYER_UPDATE_POSITION,
    position
  };
}

export function updateLoading(bytesLoaded, bytesTotal) {
  return {
    type: PLAYER_UPDATE_LOADING,
    bytesLoaded,
    bytesTotal
  };
}

export function nextTrack() {
  return {
    type: PLAYER_NEXT_TRACK
  };
}

export function finishSeeking() {
  return {
    type: PLAYER_FINISH_SEEKING
  };
}

export function useTrack(track) {
  return {
    type: PLAYER_USE_TRACK,
    track
  };
}

function createDefaultState() {
  return {
    ':app/isAuthenticated': false,
    ':app/groups': [],
    ':app/library': [],
    ':app/albums': Map(),
    ':player/isEmpty': true,
    ':player/isPlaying': false,
    ':player/position': 0,
    ':player/bytesTotal': 0,
    ':player/bytesLoaded': 0,
    ':player/tracklist': [],
    ':player/seekToPosition': 0,
    ':player/isSeeking': false
  };
}

export default function (state = createDefaultState(), action) {
  switch (action.type) {
    case AUTHENTICATE:
      return Object.assign({}, state, {
        ':app/isAuthenticated': true,
        ':app/userId': action.userId,
        ':app/accessToken': action.accessToken
      });

    case GROUPS_PUSH:
      return Object.assign({}, state, {
        ':app/groups': action.groups
      });

    case LIBRARY_PUSH:
      return Object.assign({}, state, {
        ':app/library': action.library
      });

    case ALBUMS_PUSH:
      return Object.assign({}, state, {
        ':app/albums': action.albums
      });

    case PLAYER_FORWARD:
      return Player.forward(state, action.ms);

    case PLAYER_REWIND:
      return Player.rewind(state, action.ms);

    case PLAYER_PLAY:
      return Player.play(state);

    case PLAYER_TOGGLE_PLAY:
      return Player.togglePlay(state);

    case PLAYER_TOGGLE_TRACK:
      return Player.togglePlay(state, action.track, action.tracklist);

    case PLAYER_UPDATE_POSITION:
      return Player.updatePosition(state, action.position);

    case PLAYER_UPDATE_LOADING:
      return Player.updateLoadingData(state, action.bytesLoaded, action.bytesTotal);

    case PLAYER_NEXT_TRACK:
      return Player.nextTrack(state);

    case PLAYER_FINISH_SEEKING:
      return Player.finishSeeking(state);

    case PLAYER_USE_TRACK:
      return Player.useTrack(state, action.track);

    default:
      return state;
  }
}
