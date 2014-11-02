var Immutable = require('immutable');
var app = require('app/core/app');
var Auth = require('app/core/auth');
var Track = require('app/values/track');
var layouts = require('app/layouts');

if (Auth.hasToken(location.hash)) {
  Auth.storeToLs(location.hash);
  location.hash = '';
}

app.use(require('app/services/auth'));
app.use(require('app/services/vk'));
app.use(require('app/services/player'));
app.use(require('app/services/soundmanager'));
app.use(require('app/services/layout'));
app.use(require('app/router'));

app.renderTo(document.getElementById('app'));

app.start(Immutable.Map.from({
  activity: require('app/fixtures/activity'),

  activeTrack: Track.Empty(),

  playqueue: {
    source: {
      path: 'tracks',
      name: 'Аудіозаписи'
    }
  },

  groups: {
    count: 0,
    items: Immutable.Vector.from([])
  },

  tracks: {
    count: 0,
    items: Immutable.Vector.from([])
  },

  loadingActivities: new Immutable.Set(),

  user: Auth.readFromLs(),

  layout: layouts.empty
}));
