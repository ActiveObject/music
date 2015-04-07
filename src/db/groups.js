var ISet = require('immutable').Set;
var Atom = require('app/core/atom');
var db = require('app/core/db3');
var addToSet = require('app/utils/addToSet');
var scan = require('app/core/db/consumers/scan');
var groups = new Atom(ISet());

db.install(scan(ISet(), addToSet(':app/groups')))
  .onValue(v => Atom.swap(groups, v));

module.exports = groups;
