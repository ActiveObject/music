var ISet = require('immutable').Set;
var db = require('app/core/db3');
var addToSet = require('app/utils/addToSet');

module.exports = db.scanEntity(ISet(), addToSet(':app/albums'));
