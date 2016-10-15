import { Map } from 'immutable';
import * as Player from 'app/shared/Player';

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
    case 'PLAYER_FORWARD':
      return Player.forward(state, action.ms);

    case 'PLAYER_REWIND':
      return Player.rewind(state, action.ms);

    case 'PLAYER_PLAY':
      return Player.play(state);

    case 'PLAYER_TOGGLE_PLAY':
      return Player.togglePlay(state);

    case 'PLAYER_TOGGLE_TRACK':
      return Player.togglePlay(state, action.track, action.tracklist);

    case 'PLAYER_UPDATE_POSITION':
      return Player.updatePosition(state, action.position);

    case 'PLAYER_UPDATE_LOADING':
      return Player.updateLoadingData(state, action.bytesLoaded, action.bytesTotal);

    case 'PLAYER_NEXT_TRACK':
      return Player.nextTrack(state);

    case 'PLAYER_FINISH_SEEKING':
      return Player.finishSeeking(state);

    case 'PLAYER_USE_TRACK':
      return Player.useTrack(state, action.track);

    case 'AUTHENTICATE':
      return Object.assign({}, state, {
        ':app/isAuthenticated': true,
        ':app/userId': action.userId,
        ':app/accessToken': action.accessToken
      });

    case 'GROUPS_PUSH':
      return Object.assign({}, state, {
        ':app/groups': action.groups
      });

    case 'LIBRARY_PUSH':
      return Object.assign({}, state, {
        ':app/library': action.library
      });

    case 'ALBUMS_PUSH':
      return Object.assign({}, state, {
        ':app/albums': action.albums
      });

    default:
      return state;
  }
}
