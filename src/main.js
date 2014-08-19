var Immutable = require('immutable');
var App = require('app/core/app');
var Auth = require('app/core/auth');
var routes = require('app/routes');

if (Auth.hasToken(location.hash)) {
  Auth.storeToLs(location.hash);
  location.hash = '';
}

var app = new App(Immutable.Map({
  activity: require('app/fixtures/activity'),
  activeTrack: Immutable.Map({
    id: 302544109
  })
}));

app.use(Auth.readFromLs);
app.use(routes.auth);

app.on('/', routes.main);
app.on('/groups/:id', routes.group);

app.renderTo(document.getElementById('app'));
app.start();