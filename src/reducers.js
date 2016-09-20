import { combineReducers } from 'redux';
import { reducer as player } from 'app/shared/Player';
import { addTag } from 'app/shared/Tag';

function user(state = { tag: ':app/user' }, action) {
  if (action.type === 'USER_AUTHENTICATE') {
    return {
      tag: [':app/user', ':user/authenticated'],
      id: action.userId,
      accessToken: action.accessToken
    };
  }

  if (action.type === 'USER_LOADED') {
    return addTag(Object.assign({}, state, {
      photo50: action.photo50,
      firstName: action.firstName,
      lastName: action.lastName
    }), ':user/is-loaded');
  }

  return state;
}

function groups(state = [], action) {
  if (action.type === 'GROUPS_PUSH') {
    return action.groups;
  }

  return state;
}

export default combineReducers({
  player,
  user,
  groups
});
