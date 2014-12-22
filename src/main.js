var app = require('app/core/app');

app.use(require('app/services/auth'));
app.use(require('app/vk/service'));
app.use(require('app/soundmanager/service'));
app.use(require('app/services/store'));
app.use(require('app/services/player'));
app.use(require('app/router'));
app.use(require('app/services/local-storage'));
// app.use(require('app/services/firebase')('https://ac-music.firebaseio.com/'));
app.use(require('app/renderer')(document.getElementById('app')));

app.start();

window.Perf = require('react/addons').addons.Perf;
window.app = app;
window.appstate = require('app/core/appstate');
