import Atom from 'app/Atom';

var appState = new Atom(null);

var app = {
  /**
   * Modifies app prototype chain:
   *
   * app -> System -> Atom -> EventEmitter -> Object
   */
  use: function (initSystem) {
    var appProto = Object.create(appState);
    initSystem(appProto);
    Object.setPrototypeOf(app, appProto);
    return app;
  },

  run: function (initialState, view, update) {
    Atom.swap(app, initialState);
    view(app.value);

    app.push = function (v) {
      Atom.swap(app, update(app.value, v));
      view(app.value);
    };

    return app;
  }
};

export default app
