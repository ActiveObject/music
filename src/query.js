var _ = require('underscore');
var isEmpty = require('app/utils').isEmpty;

function getActiveTrack(db) {
  if (db.get('activeTrack').isEmpty()) {
    var queue = getPlayqueueItems(db).filter(_.negate(isEmpty));

    if (queue.count() > 0) {
      return queue.first();
    }
  }

  return db.get('activeTrack');
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