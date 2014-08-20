var cursor = module.exports = function cursor(value, listener) {
  function cursorFn(fn) {
    return fn(typeof value === 'function' ? value() : value, listener);
  }

  cursorFn.__proto__ = cursor;
  cursorFn.value = value;
  cursorFn.listener = listener;

  return cursorFn;
};

cursor.cursor = function (path) {
  return cursor(followPath(this.value, path), setValue(this.value, path, this.listener));
};

function followPath(value, path) {
  return function followPath() {
    var val = typeof value === 'function' ? value() : value;
    return val.get(path);
  };
}

function setValue(value, path, listener) {
  return function setValue(newState) {
    var val = typeof value === 'function' ? value() : value;
    return listener(val.set(path, newState));
  };
}