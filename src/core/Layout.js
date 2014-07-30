var curry = require('curry');

exports.make = curry(function(views, appstate) {
  if (!Array.isArray(views)) {
    return views(appstate);
  }

  return views.map(function(view) {
    return view(appstate);
  });
});