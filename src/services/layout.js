module.exports = function (receive) {
  receive(':app/layout', function (appstate, layout) {
    return appstate.set('layout', layout);
  });
};
