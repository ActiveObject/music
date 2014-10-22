var Immutable = require('immutable');
var app = require('app/core/app');
var Auth = require('app/core/auth');
var Track = require('app/models/track');
var routes = require('app/routes');

if (Auth.hasToken(location.hash)) {
  Auth.storeToLs(location.hash);
  location.hash = '';
}

app.use(require('app/services/vk'));
app.use(require('app/services/player'));
app.use(require('app/services/soundmanager'));

app.r(routes.auth);
app.on('/', routes.main);
app.on('/index.html', routes.main);
app.on('/groups/:id', routes.group);

app.renderTo(document.getElementById('app'));

app.start(Immutable.Map.from({
  activity: require('app/fixtures/activity'),

  activeTrack: new Track.Empty(),

  playqueue: {
    source: {
      path: 'tracks',
      name: 'Аудіозаписи'
    },

    items: []
  },

  groups: {
    count: 0,
    items: []
  },

  tracks: {
    count: 0,
    items: []
  },

  loadingActivities: new Immutable.Set(),

  user: Auth.readFromLs()
}));
