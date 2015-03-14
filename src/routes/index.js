/**
 * type Route =
 *   | EmptyRoute
 *   | MainRoute
 *   | ArtistRoute of name
 *   | GroupRoute of id
 *   | AuthRoute of vkAccount
 *
 * interface Route =
 *   render: (appstate) -> ReactElement
 *   lifecycle: RouteLifecycle
 */

var MainRoute = require('./main-route');
var GroupRoute = require('./group-route');
var ArtistRoute = require('./artist-route');
var emptyRoute = require('./empty-route');

exports.fromJSON = function (v) {
  if (v['router:main-route']) {
    return MainRoute.fromJSON(v['router:main-route']);
  }

  if (v['router:group-route']) {
    return GroupRoute.fromJSON(v['router:group-route']);
  }

  if (v['router:artist-route']) {
    return ArtistRoute.fromJSON(v['router:artist-route']);
  }

  return emptyRoute;
};