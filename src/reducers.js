import { Map } from 'immutable';
import { reducer as player, createPlayer } from 'app/shared/Player';
import { addTag } from 'app/shared/Tag';

function createDefaultState() {
  return Object.assign({
    ':app/isAuthenticated': false,
    ':app/groups': [],
    ':app/library': [],
    ':app/albums': Map()
  }, createPlayer());
}

export default function (state = createDefaultState(), action) {
  var state = player(state, action);

  if (action.type === 'AUTHENTICATE') {
    return Object.assign({}, state, {
      ':app/isAuthenticated': true,
      ':app/userId': action.userId,
      ':app/accessToken': action.accessToken
    });
  }

  if (action.type === 'GROUPS_PUSH') {
    return Object.assign({}, state, {
      ':app/groups': action.groups
    });
  }

  if (action.type === 'LIBRARY_PUSH') {
    return Object.assign({}, state, {
      ':app/library': action.library
    });
  }

  if (action.type === 'ALBUMS_PUSH') {
    return Object.assign({}, state, {
      ':app/albums': action.albums
    });
  }

  return state;
}
