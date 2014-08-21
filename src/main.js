var Immutable = require('immutable');
var app = require('app/core/app');
var Auth = require('app/core/auth');
var routes = require('app/routes');
var actions = require('app/actions');

if (Auth.hasToken(location.hash)) {
  Auth.storeToLs(location.hash);
  location.hash = '';
}

app.r(routes.auth);

app.use(actions.loadGroups);
app.use(actions.loadTracks);
app.use(actions.updateActiveTrack);

app.on('/', routes.main);
app.on('/groups/:id', routes.group);

app.renderTo(document.getElementById('app'));
app.start(Immutable.fromJS({
  activity: require('app/fixtures/activity'),

  activeTrack: {
    artist: 'Flux Pavilion',
    title: 'Got I to Know',
    duration: 350
  },

  groups: [],
  tracks: [],

  user: Auth.readFromLs()
}));

module.exports = app;