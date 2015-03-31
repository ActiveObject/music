var Atom = require('app/core/atom');
var gid = 1;

function Database(attrs) {
  this.queries = attrs.queries;
}

Database.prototype.install = function (atom, queryFn) {
  var id = gid++;

  this.queries.push({
    id: id,
    atom: atom,
    fn: queryFn,
    initialValue: Atom.value(atom)
  });

  return () => {
    this.queries = this.queries.filter(v => v.id !== id);
  };
};

Database.prototype.play = function (values) {
  console.time('db.play');
  var next = (i) => {
    if (i >= this.queries.length) {
      return;
    }

    var query = this.queries[i];
    var newVal = values.reduce((acc, v) => query.fn(acc, v), query.initialValue);
    Atom.swap(query, newVal);
    next(i + 1);
  };

  next(0);
  // var queries = values.map(v => this.tick(v))
  // console.log(queries);
  console.timeEnd('db.play');
};

Database.prototype.tick = function (v) {
  return this.queries.map(function (query) {
    var newVal = query.fn(query.atom.value, v);
    Atom.swap(query, newVal);
    return newVal;
  });
};

Database.prototype.reset = function() {
  this.queries.forEach(function (query) {
    Atom.swap(query, query.initialValue);
  });

  return this;
};

module.exports = new Database({ queries: [] });
