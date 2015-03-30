var Atom = require('app/core/atom');
var Bacon = require('baconjs');
var gid = 1;

function Database(attrs) {
  this.queries = attrs.queries;
  this.in = new Bacon.Bus();
  this.in.onValue(v => {
    this.queries.forEach(function (query) {
      var newVal = query.fn(query.atom.value, v);
      Atom.swap(query, newVal);
    });
  });
}

Database.prototype.install = function (atom, queryFn) {
  var id = gid++;

  this.queries.push({
    id: id,
    atom: atom,
    fn: queryFn
  });

  return () => {
    this.queries = this.queries.filter(v => v.id !== id);
  };
};

module.exports = new Database({ queries: [] });