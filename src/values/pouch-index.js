var _ = require('underscore');
var List = require('immutable').List;
var PouchDb = require('pouchdb');
var Url = require('url');

function PouchIndex(attrs) {
  this.createdAt = new Date();
  this.db = attrs.db;
  this.docName = attrs.docName;
  this.isBuilt = attrs.isBuilt;
  this.items = attrs.items;
  this.building = attrs.building;
}

PouchIndex.empty = new PouchIndex({
  isBuilt: false,
  building: false,
  items: List()
});

PouchIndex.prototype.isBuilding = function () {
  return this.building;
};

PouchIndex.prototype.build = function () {
  return this.modify({ building: true });
};

PouchIndex.prototype.fromResponse = function (res) {
  var items = res.rows.map(function (row) {
    return row.doc.datoms;
  });

  return this.modify({
    items: items,
    isBuilt: true,
    building: false
  });
};

PouchIndex.prototype.push = function (datoms) {
  return this;
};

PouchIndex.prototype.modify = function (attrs) {
  return new PouchIndex(_.extend({}, this, attrs));
};

PouchIndex.prototype.fromDb = function (url) {
  var dbUrl = Url.parse(url),
      docName = dbUrl.pathname.split('/')[2],
      dbName = Url.format({
        protocol: dbUrl.protocol,
        host: dbUrl.host,
        pathname: dbUrl.pathname.split('/')[1]
      });

  return this.modify({
    db: new PouchDb(url),
    docName: docName,
    isBuilt: false,
    items: List()
  });
};

PouchIndex.prototype.fetch = function (callback) {
  var db = this.db,
      name = this.docName,
      index = this;

  function init() {
    db.get(name, function (err, res) {
      if (err) {
        return callback(err);
      }

      db.allDocs({
        include_docs: true,
        keys: res.segments
      }, function (err, response) {
        if (err) {
          return callback(err);
        }

        callback(null, index.fromResponse(response));
      });
    });
  }

  db.get(name, function (err, res) {
    if (err) {
      if (err.status === 404) {
        return db.put({ _id: name, segments: [] }, function (err, res) {
          if (err) {
            return callback(err);
          }

          init();
        });
      }

      return callback(err);
    }

    init();
  });
};

module.exports = PouchIndex;