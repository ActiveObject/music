var _ = require('underscore');
var Immutable = require('immutable');
var isString = require('underscore').isString;
var vbus = require('app/core/vbus');
var BufferedEventStream = require('app/core/buffered-event-stream');
var Atom = require('app/core/atom');
var dispatch = require('app/core/dispatcher');

var isValue = require('app/utils/isValue');
var tagOf = require('app/utils/tagOf');
var valueOf = require('app/utils/valueOf');

module.exports = new Atom(Immutable.Map());
