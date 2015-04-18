var ISet = require('immutable').Set;
var db = require('app/core/db3');
var addToSet = require('app/fn/addToSet');

module.exports = db.scanEntity(ISet(), addToSet(':app/groups'));
