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

AuthenticatedUser.prototype.isAuthenticated = function () {
  return true;
};

AuthenticatedUser.prototype.toString = function () {
  return 'AuthenticatedUser(' + this.id + ')';
};

function UnauthenticatedUser() {

}

UnauthenticatedUser.prototype.isAuthenticated = function () {
  return false;
};

exports.Authenticated = AuthenticatedUser;
exports.Unauthenticated = UnauthenticatedUser;
