module.exports = function (receive) {
  receive(':layout', function (appstate, layout) {
    return appstate.set('layout', layout);
  });
};