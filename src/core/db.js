var Atom = require('app/core/atom');

function Database(attrs) {
  this.queries = attrs.queries;
}

function TickRecord(attrs) {
  this.value = attrs.value;
  this.startTime = attrs.startTime;
  this.endTime = attrs.endTime;
  this.results = attrs.results;
}

function AppliedTickRecord(attrs) {
  this.tick = attrs.tick;
  this.times = attrs.times;
}

TickRecord.prototype.applyTo = function(queries) {
  return new AppliedTickRecord({
    tick: this,
    times: this.results.map(function (result, i) {
      var startTime = performance.now();
      Atom.swap(queries[i], result.value);
      return {
        startTime: startTime,
        endTime: performance.now()
      };
    })
  });
};

function Query(atom, fn) {
  this.atom = atom;
  this.fn = fn;
  this.initialValue = Atom.value(atom);
}

Query.prototype.tick = function(v) {
  var startTime = performance.now();
  var r = this.fn(this.atom.value, v);

  return {
    value: r,
    startTime: startTime,
    endTime: performance.now()
  };
};

Database.prototype.install = function (atom, queryFn) {
  var query = new Query(atom, queryFn);
  this.queries.push(query);

  return () => {
    this.queries = this.queries.filter(v => v !== query);
  };
};

Database.prototype.tick = function (v) {
  var startTime = performance.now();
  var results = this.queries.map(query => query.tick(v));

  var tr = new TickRecord({
    value: v,
    startTime: startTime,
    endTime: performance.now(),
    results: results
  });

  return tr.applyTo(this.queries);
};

Database.prototype.reset = function() {
  this.queries.forEach(function (query) {
    Atom.swap(query, query.initialValue);
  });

  this.queries = [];

  return this;
};

module.exports = new Database({ queries: [] });
