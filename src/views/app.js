var App = require('app/components/App');
var View = require('app/core/View');

module.exports = new View(function(appstate, children) {
  return new App(appstate, children);
});