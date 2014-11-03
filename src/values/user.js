var _ = require('underscore');

function AuthenticatedUser(options) {
  if (!_.has(options, 'id')) {
    throw new TypeError('Authenticated user must have an id');
  }

  if (!_.has(options, 'accessToken')) {
    throw new TypeError('Authenticated user must have an access_token');
  }

  this.id = options.id;
  this.accessToken = options.accessToken;
}

function UnauthenticatedUser() {

}

exports.Authenticated = AuthenticatedUser;
exports.Unauthenticated = UnauthenticatedUser;