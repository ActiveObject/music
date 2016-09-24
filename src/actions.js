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
