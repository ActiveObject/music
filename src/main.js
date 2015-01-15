var app = require('app/core/app');
var appstate = require('app/core/appstate');
var Atom = require('app/core/atom');
var render = require('app/renderer')(document.getElementById('app'));

app.use(require('app/services/auth-service'));
app.use(require('app/services/vk-service'));
app.use(require('app/services/soundmanager-service'));
app.use(require('app/services/store-service'));
app.use(require('app/services/player-service'));
app.use(require('app/services/local-storage-service'));
app.use(require('app/services/router-service'));
// app.use(require('app/services/firebase-service')('https://ac-music.firebaseio.com/'));

Atom.listen(appstate, render);

document.addEventListener('visibilitychange', function() {
  render(appstate.atom.value);
}, false);

app.start();

window.Perf = require('react/addons').addons.Perf;
window.app = app;
window.appstate = require('app/core/appstate');
window.render = render;
