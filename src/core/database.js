var List = require('immutable').List;

function Database(datoms) {
  this.createdAt = new Date();
  this.datoms = datoms;
  this.entities = this.datoms.groupBy(function (datom) {
    return datom[0];
  }).map(function (datoms) {
    var attrs = {};

    datoms.forEach(function (datom) {
      attrs[datom[1]] = datom[2];
    });

    return attrs;
  });
}

Database.empty = new Database(List());

module.exports = Database;