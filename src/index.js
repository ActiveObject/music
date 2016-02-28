import Atom from 'app/Atom';

var appState = new Atom(null);
var app = Object.create(appState);

app.run = function (initialState, view, update) {
  app.push = function (v) {
    Atom.swap(app, update(app.value, v));
    view(app.value);
  };

  Atom.swap(app, initialState);
  view(app.value);

  return app;
};

export default app;
