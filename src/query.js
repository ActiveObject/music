var _ = require('underscore');
var isEmpty = require('app/utils').isEmpty;

function getActiveTrack(activeTrack, queue) {
  if (activeTrack.isEmpty()) {
    if (queue.tracks.count() > 0) {
      return queue.tracks.first();
    }
  }

  return activeTrack;
}

function getPlayqueueItems(db) {
  return db.get(db.get('playqueue').source.path).items;
}

function getGroups(db) {
  return db.get('groups').items.slice(0, 3).filter(_.negate(isEmpty));
}

exports.getPlayqueueItems = getPlayqueueItems;
exports.getActiveTrack = getActiveTrack;
exports.getGroups = getGroups;