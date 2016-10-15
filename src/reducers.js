import { Map } from 'immutable';
import {
  forward,
  rewind,
  play,
  togglePlay,
  updatePosition,
  updateLoadingData,
  nextTrack,
  finishSeeking,
  useTrack
} from 'app/shared/Player';

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
      return forward(state, action.ms);

    case 'PLAYER_REWIND':
      return rewind(state, action.ms);

    case 'PLAYER_PLAY':
      return play(state);

    case 'PLAYER_TOGGLE_PLAY':
      return togglePlay(state);

    case 'PLAYER_TOGGLE_TRACK':
      return togglePlay(state, action.track, action.tracklist);

    case 'PLAYER_UPDATE_POSITION':
      return updatePosition(state, action.position);

    case 'PLAYER_UPDATE_LOADING':
      return updateLoadingData(state, action.bytesLoaded, action.bytesTotal);

    case 'PLAYER_NEXT_TRACK':
      return nextTrack(state);

    case 'PLAYER_FINISH_SEEKING':
      return finishSeeking(state);

    case 'PLAYER_USE_TRACK':
      return useTrack(state, action.track);

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
