var Sidebar = require('app/components/Sidebar');
var AppView = require('app/views/app');

module.exports = AppView.child(function(appstate) {
  return new Sidebar(appstate);
});