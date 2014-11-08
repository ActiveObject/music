module.exports = function (receive) {
  receive('layout:change', function (appstate, layout) {
    return appstate.set('layout', layout);
  });
};