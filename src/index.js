import Atom from 'app/Atom';

var appState = new Atom(null);

var app = {
  view: function (key, equal) {
    var x = new Atom(app.value.get(key));
    var prevVal = null;
    var isFirstRun = true;

    Atom.listen(appState, function (nextVal) {
      if (isFirstRun) {
        isFirstRun = false;
        prevVal = nextVal;
        return;
      }

      if (!equal) {
        equal = function (x, y) {
          return x === y;
        };
      }

      if (!equal(prevVal.get(key), nextVal.get(key))) {
        Atom.swap(x, nextVal.get(key));
      }

      prevVal = nextVal;
    });

    return x;
  },

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
