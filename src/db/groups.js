var ISet = require('immutable').Set;
var Atom = require('app/core/atom');
var db3 = require('app/core/db3');
var dbin = require('app/core/dbin');
var addToSet = require('app/utils/addToSet');

var groups = new Atom(ISet());

db3.install(db3.scan(ISet(), addToSet(':app/groups')), dbin).onValue(v => Atom.swap(groups, v));

module.exports = groups;
