var Main = require('app/components/Main');
var AppView = require('app/views/app');

module.exports = AppView.child(function(appstate) {
  return new Main(appstate);
});