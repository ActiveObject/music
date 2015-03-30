var Bacon = require('baconjs');
var debug = require('debug')('app:core:go');

var processNum = 0;

module.exports = function go(process) {
  processNum++;

  var id = [processNum, process.toString()].join(':');
  var output = new Bacon.Bus();
  var input = new Bacon.Bus();

  debug('spawn - %s', id);

  output.onError(err => console.log(err));
  output.onEnd(function() {
    debug('end - %s', id);
    input.end();
  });

  process.go(input, output);

  return output;
};
