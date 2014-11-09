var List = require('immutable').List;
var getOrDefault = require('app/utils').getOrDefault;

function PouchIndex(db, isBuilt, items, itemConstructor, building) {
  this.createdAt = new Date();
  this.db = db;
  this.isBuilt = isBuilt;
  this.items = items;
  this.itemConstructor = itemConstructor;
  this.building = building;
}

PouchIndex.prototype.isBuilding = function () {
  return this.building;
};

PouchIndex.prototype.build = function () {
  return this.modify({ building: true });
};

PouchIndex.prototype.fromResponse = function (res) {
  var tracks = res.rows.map(function (row) {
    return this.itemConstructor(row);
  }, this);

  return this.modify({
    items: tracks,
    isBuilt: true,
    building: false
  });
};

PouchIndex.prototype.modify = function (attrs) {
  var db = getOrDefault(attrs, 'db', this.db),
      isBuilt = getOrDefault(attrs, 'isBuilt', this.isBuilt),
      items = getOrDefault(attrs, 'items', this.items),
      itemConstructor = getOrDefault(attrs, 'itemConstructor', this.itemConstructor),
      building = getOrDefault(attrs, 'building', this.building);

  return new PouchIndex(db, isBuilt, items, itemConstructor, building);
};

module.exports = PouchIndex;