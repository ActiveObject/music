var List = require('immutable').List;
var Tracks = require('app/values/tracks');

function Playqueue(tracks) {
  this.tracks = tracks;
}

Playqueue.prototype.setSource = function (source) {
  return new Playqueue(source);
};

Playqueue.prototype.getAll = function () {
  return this.tracks.getAll();
};

Playqueue.prototype.isLastTrack = function (track) {
  var tracks = this.getAll();
  var activeIndex = tracks.findIndex(function (t) {
    return t.id === track.id;
  });

  return activeIndex === tracks.count();
};

Playqueue.prototype.nextAfter = function (track) {
  var tracks = this.getAll();
  var activeIndex = tracks.findIndex(function (t) {
    return t.id === track.id;
  });

  return tracks.get(activeIndex + 1);
};

module.exports = Playqueue;
module.exports.empty = new Playqueue(Tracks.empty);