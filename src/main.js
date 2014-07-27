var AppState = require('app/core/AppState');
var Layout = require('app/core/Layout');
var GroupsStore = require('app/stores/GroupsStore');
var views = require('app/views');

var app = new AppState(function() {
  return {
    user: { id: 123 },
    groups: [{ id: 1, name: 'Group 1'}, { id: 2, name: 'Group 2' }],
    layout: [views.main, views.activeTrack, views.tracks.all()]
  };
});

app.use(Layout.make(views.app));
app.renderTo('#app');