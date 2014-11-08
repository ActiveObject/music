var _ = require('underscore');
var isEmpty = require('app/utils').isEmpty;

function getActiveTrack(activeTrack, queue) {
  if (activeTrack.isEmpty()) {
    if (queue.tracks.size() > 0) {
      return queue.tracks.first();
    }
  }

  return activeTrack;
}

exports.getActiveTrack = getActiveTrack;