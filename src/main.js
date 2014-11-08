var Immutable = require('immutable');
var app = require('app/core/app');
var Auth = require('app/core/auth');
var Track = require('app/values/track');
var Tracks = require('app/values/tracks');
var Groups = require('app/values/groups');
var Playqueue = require('app/values/playqueue');
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
app.use(require('app/services/tracks'));
app.use(require('app/router'));

app.renderTo(document.getElementById('app'));

app.start(Immutable.Map({
  activity: require('app/fixtures/activity'),
  activeTrack: Track.empty,
  playqueue: Playqueue.empty,
  groups: Groups.empty,
  tracks: new Tracks(0, Immutable.List(), app.send),
  user: Auth.readFromLs(),
  layout: layouts.empty
}));

window.Perf = require('react/addons').addons.Perf;
