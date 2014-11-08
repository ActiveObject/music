var List = require('immutable').List;

function Groups(total, items) {
  this.count = total;
  this.items = items;
}

module.exports = Groups;
module.exports.empty = new Groups(0, List());