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
