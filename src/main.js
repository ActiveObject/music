var app = require('app/core/app');

app.use(require('app/services/auth'));
app.use(require('app/vk/service'));
app.use(require('app/soundmanager/service'));
app.use(require('app/services/player'));
app.use(require('app/services/layout'));
app.use(require('app/services/tracks'));
app.use(require('app/services/groups'));
app.use(require('app/router'));

app.renderTo(document.getElementById('app'));
app.start();

window.Perf = require('react/addons').addons.Perf;
window.app = app;
window.db = require('app/core/db');
