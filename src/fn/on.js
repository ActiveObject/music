export default function on(emitter, event, fn) {
  emitter.on(event, fn);

  return function() {
    emitter.removeListener(event, fn);
  };
}
