import { Map } from 'immutable';
import { reducer as player, createPlayer } from 'app/shared/Player';
import { addTag } from 'app/shared/Tag';

function createDefaultState() {
  return Object.assign({
    user: {
      tag: ':app/user'
    },
    groups: [],
    library: [],
    albums: Map()
  }, createPlayer());
}

export default function (state = createDefaultState(), action) {
  var state = player(state, action);

  if (action.type === 'USER_AUTHENTICATE') {
    return Object.assign({}, state, {
      user: {
        tag: [':app/user', ':user/authenticated'],
        id: action.userId,
        accessToken: action.accessToken
      }
    });
  }

  if (action.type === 'USER_LOADED') {
    return Object.assign({}, state, {
      user: addTag(Object.assign({}, state.user, {
        photo50: action.photo50,
        firstName: action.firstName,
        lastName: action.lastName
      }), ':user/is-loaded')
    });
  }

  if (action.type === 'GROUPS_PUSH') {
    return Object.assign({}, state, {
      groups: action.groups
    });
  }

  if (action.type === 'LIBRARY_PUSH') {
    return Object.assign({}, state, {
      library: action.library
    });
  }

  if (action.type === 'ALBUMS_PUSH') {
    return Object.assign({}, state, {
      albums: action.albums
    });
  }

  return state;
}
