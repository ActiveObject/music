import Atom from 'app/Atom';

var app = Object.create(new Atom(null));

export function run(initialState, view, update) {
  app.push = function (v) {
    Atom.swap(app, update(app.value, v));
    view(app.value);
  };

  Atom.swap(app, initialState);
  view(app.value);

  return app;
};

export default app;
