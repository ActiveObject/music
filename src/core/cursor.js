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
  console.log('make sub path cursor')
  return cursor(followPath(this.value, path), setValue(this.value, path, this.listener));
};

function followPath(value, path) {
  return function followPath() {
    return value.get(path);
  };
}

function setValue(value, path, listener) {
  return function setValue(newState) {
    return listener(value.set(path, newState));
  };
}