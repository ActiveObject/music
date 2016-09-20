export function authenticate(userId, accessToken) {
  return {
    type: 'USER_AUTHENTICATE',
    userId,
    accessToken
  };
}

export function loaded(res) {
  return {
    type: 'USER_LOADED',
    photo50: res.photo_50,
    firstName: res.first_name,
    lastName: res.last_name
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
