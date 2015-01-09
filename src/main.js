var app = require('app/core/app');

app.use(require('app/services/auth-service'));
app.use(require('app/services/vk-service'));
app.use(require('app/services/soundmanager-service'));
app.use(require('app/services/store-service'));
app.use(require('app/services/player-service'));
app.use(require('app/services/local-storage-service'));
app.use(require('app/services/router'));
// app.use(require('app/services/firebase-service')('https://ac-music.firebaseio.com/'));
app.use(require('app/renderer')(document.getElementById('app')));

app.start();

window.Perf = require('react/addons').addons.Perf;
// window.app = app;
window.appstate = require('app/core/appstate');
