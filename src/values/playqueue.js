var List = require('immutable').List;

function Playqueue(tracks) {
  this.tracks = tracks;
}

Playqueue.prototype.setSource = function (source) {
  return new Playqueue(source);
};

module.exports = Playqueue;
module.exports.empty = new Playqueue(List());