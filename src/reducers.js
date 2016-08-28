import { rewind, forward, togglePlay, nextTrack, finishSeeking } from 'app/shared/Player';

export default function (state, action) {
  switch (action.type) {
    case 'PLAYER_FORWARD': return forward(state, action.ms);
    case 'PLAYER_REWIND': return rewind(state, action.ms);
    case 'PLAYER_TOGGLE_PLAY': return togglePlay(state);
    case 'PLAYER_TOGGLE_TRACK': return togglePlay(state, action.track, action.tracklist);
    case 'PLAYER_UPDATE_POSITION': return Object.assign({}, state, { position: action.position });
    case 'PLAYER_UPDATE_LOADING': return Object.assign({}, state, { bytesLoaded: action.bytesLoaded, bytesTotal: action.bytesTotal });
    case 'PLAYER_NEXT_TRACK': return nextTrack(state);
    case 'PLAYER_FINISH_SEEKING': return finishSeeking(state);
  }

  return state;
}
