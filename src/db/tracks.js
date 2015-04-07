var ISet = require('immutable').Set;
var Atom = require('app/core/atom');
var db = require('app/core/db3');
var addToSet = require('app/utils/addToSet');
var scan = require('app/core/db/consumers/scan');
var tracks = new Atom(ISet());

db.install(scan(ISet(), addToSet(':app/tracks')))
  .onValue(v => Atom.swap(tracks, v));

module.exports = tracks;
