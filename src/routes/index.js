/**
 * type Route =
 *   | EmptyRoute
 *   | MainRoute
 *   | ArtistRoute of name
 *   | GroupRoute of id
 *   | AuthRoute of vkAccount
 *
 * interface Route =
 *   render: (appstate, send) -> ReactElement
 *   lifecycle: RouteLifecycle
 */

var MainRoute = require('./main-route');
var GroupRoute = require('./group-route');
var ArtistRoute = require('./artist-route');
var emptyRoute = require('./empty-route');

exports.fromJSON = function (v) {
  if (v['main-route']) {
    return MainRoute.fromJSON(v['main-route']);
  }

  if (v['group-route']) {
    return GroupRoute.fromJSON(v['group-route']);
  }

  if (v['artist-route']) {
    return ArtistRoute.fromJSON(v['artist-route']);
  }

  return emptyRoute;
};