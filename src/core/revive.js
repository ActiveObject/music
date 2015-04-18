var PSet = require('immutable').Set;
var PMap = require('immutable').Map;

var soundmanager = require('app/soundmanager');
var routes = require('app/routes');
var Track = require('app/values/track');
var Group = require('app/values/group');
var Album = require('app/values/album');
var NewsfeedActivity = require('app/values/newsfeed-activity');
var player = require('app/values/player');
var firstValue = require('app/fn/firstValue');

module.exports = function revive(key, value) {
  if (key === 'soundmanager') {
    return soundmanager.fromJSON(value);
  }

  if (key === 'activeRoute') {
    return routes.fromJSON(value);
  }

  if (key === 'app/values/track') {
    return Track.fromJSON(value);
  }

  if (key === 'app/values/player') {
    return player.fromJSON(value);
  }

  if (key === 'app/values/group') {
    return Group.fromJSON(value);
  }

  if (key === 'app/values/album') {
    return Album.fromJSON(value);
  }

  if (key === 'app/values/newsfeed-activity') {
    return new NewsfeedActivity(value);
  }

  if (key === 'player') {
    return firstValue(value);
  }

  if (key === 'tracks') {
    return PSet(value.map(firstValue));
  }

  if (key === 'groups') {
    return PSet(value.map(firstValue));
  }

  if (key === 'albums') {
    return PSet(value.map(firstValue));
  }

  if (key === 'activities') {
    return PSet(value.map(firstValue));
  }

  return value;
};
