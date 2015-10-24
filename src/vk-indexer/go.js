var Kefir = require('kefir');
var debug = require('debug')('app:core:go');

var processNum = 0;

module.exports = function go(process) {
  processNum++;

  var id = [processNum, process.toString()].join(':');
  var output = Kefir.emitter();
  var input = Kefir.emitter();

  debug('spawn - %s', id);

  output.onError(err => console.log(err));
  output.onEnd(function() {
    debug('end - %s', id);
    input.end();
  });

  process.go(input, output);

  return output;
};
