var _ = require('underscore');
var Track = require('app/values/track');

function getActiveTrack(db) {
  if (Track.isEmpty(db.get('activeTrack'))) {
    var queue = getPlayqueueItems(db);

    if (queue.count() > 0) {
      return queue.first();
    }
  }

  return db.get('activeTrack');
}

function getPlayqueueItems(db) {
  return db.get(db.get('playqueue').source.path).items.filter(_.negate(Track.isEmpty));
}

exports.getPlayqueueItems = getPlayqueueItems;
exports.getActiveTrack = getActiveTrack;