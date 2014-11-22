var React = require('react');
var curry = require('curry');
var Vk = require('app/services/vk');
var AuthView = require('app/components/auth');
var accounts = require('app/accounts');

exports.main = require('./main');
exports.group = require('./group');
exports.artist = require('./artist');

exports.auth = function (appstate) {
  return new AuthView({
    url: Vk.makeAuthUrl(accounts.vk)
  });
};

exports.empty = function (appstate) {
  return React.DOM.div();
};