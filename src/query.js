var _ = require('underscore');
var isEmpty = require('app/utils').isEmpty;

function getActiveTrack(db) {
  if (db.get('activeTrack').isEmpty()) {
    var queue = getPlayqueueItems(db);

    if (queue.count() > 0) {
      return queue.first();
    }
  }

  return db.get('activeTrack');
}

function getPlayqueueItems(db) {
  return db.get(db.get('playqueue').source.path).items.filter(_.negate(isEmpty));
}

exports.getPlayqueueItems = getPlayqueueItems;
exports.getActiveTrack = getActiveTrack;