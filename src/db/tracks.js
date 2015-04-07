var ISet = require('immutable').Set;
var Atom = require('app/core/atom');
var db3 = require('app/core/db3');
var dbin = require('app/core/dbin');
var addToSet = require('app/utils/addToSet');

var tracks = new Atom(ISet());

db3.install(db3.scan(ISet(), addToSet(':app/tracks')), dbin).onValue(v => Atom.swap(tracks, v));

module.exports = tracks;
