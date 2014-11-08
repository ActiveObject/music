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

module.exports = Playqueue;
module.exports.empty = new Playqueue(Tracks.empty);