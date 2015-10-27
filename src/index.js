import Atom from 'app/Atom';
import vbus from 'app/vbus';

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
    vbus.on('value', v => Atom.swap(app, update(app.value, v)));
    Atom.listen(app, view);
    Atom.swap(app, initialState);
    return app;
  }
};

export default app
