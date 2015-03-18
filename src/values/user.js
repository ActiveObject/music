var _ = require('underscore');

function AuthenticatedUser(attrs) {
  if (!(this instanceof AuthenticatedUser)) {
    return new AuthenticatedUser(attrs);
  }

  if (!_.has(attrs, 'id')) {
    throw new TypeError('Authenticated user must have an id');
  }

  if (!_.has(attrs, 'accessToken')) {
    throw new TypeError('Authenticated user must have an access_token');
  }

  this.id = attrs.id;
  this.accessToken = attrs.accessToken;
}

AuthenticatedUser.prototype.isAuthenticated = function () {
  return true;
};

AuthenticatedUser.prototype.tag = function () {
  return ':app/user';
};

AuthenticatedUser.prototype.rep = function () {
  return {
    id: this.id,
    accessToken: this.accessToken
  };
};

AuthenticatedUser.prototype.toString = function () {
  return 'AuthenticatedUser(' + this.id + ')';
};

function UnauthenticatedUser() {

}

UnauthenticatedUser.prototype.tag = function() {
  return ':app/user';
};

UnauthenticatedUser.prototype.isAuthenticated = function () {
  return false;
};

exports.Authenticated = AuthenticatedUser;
exports.Unauthenticated = UnauthenticatedUser;
