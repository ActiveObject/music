module.exports = function (dbStream, receive) {
  receive('layout:change', function (appstate, layout) {
    return appstate.set('layout', layout);
  });
};