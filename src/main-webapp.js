var PMap = require('immutable').Map;
var app = require('app');
var Atom = require('app/core/atom');
var render = require('app/core/renderer')(document.getElementById('app'));
var revive = require('app/core/revive');

require('app/core/request').useJsonp();

app.use(require('app/services/auth-service'));
app.use(require('app/services/vk-service'));
app.use(require('app/services/soundmanager-service'));
app.use(require('app/services/store-service'));
app.use(require('app/services/player-service'));
app.use(require('app/services/local-storage-service'));
app.use(require('app/services/router-service'));
app.use(require('app/services/vk-indexing-service'));
// app.use(require('app/services/firebase-service')('https://ac-music.firebaseio.com/'));

Atom.listen(app, render);

document.addEventListener('visibilitychange', function() {
  render(Atom.value(app));
}, false);

app.start();

if (process.env.NODE_ENV === 'development') {
  window.dev = require('app/devtool')(app);
  window.TimeRecord = require('app/devtool/time-record');
  window.Perf = require('react/addons').addons.Perf;
  window.app = app;
  window.render = render;
  window.stats = require('app/core/stats');

  Perf.start();
}

