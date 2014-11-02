var _ = require('underscore');
var Url = require('url');
var { Vector } = require('immutable');
var Promise = require('when').Promise;
var app = require('app/core/app');
var accounts = require('app/accounts');
var User = require('app/values/user');
var Group = require('app/values/group');
var Track = require('app/values/track');
var isEmpty = require('app/utils').isEmpty;
var VkApi = require('./vk-api') ;

function fetchGroups(vk, user, offset, count, callback) {
  vk.groups.get({
    user_id: user.id,
    extended: 1,
    offset: offset,
    count: count,
    v: '5.25'
  }, callback);
}

function fetchTracks(vk, user, offset, count, callback) {
  vk.audio.get({
    owner_id: user.id,
    offset: offset,
    count: count,
    v: '5.25'
  }, callback);
}

function fetchInitialData(vk, appstate) {
  fetchGroups(vk, appstate.get('user'), 0, 10, function (err, result) {
    app.send('groups:load', {
      offset: 0,
      count: 10,
      response: result.response
    });
  });

  fetchTracks(vk, appstate.get('user'), 0, 10, function (err, result) {
    app.send('tracks:load', {
      offset: 0,
      count: 10,
      response: result.response
    });
  });

  var groups = _.range(0, 10).map(Group.Empty);
  var tracks = _.range(0, 10).map(Track.Empty);

  return appstate
    .set('groups', { count: 10, items: Vector.from(groups) })
    .set('tracks', { count: 10, items: Vector.from(tracks) });
}

function loadGroups(vk, appstate, data, batchCount) {
  var currentItemsCount = appstate.get('groups').items.count();

  if (currentItemsCount < data.response.count ) {
    fetchGroups(vk, appstate.get('user'), currentItemsCount, batchCount, function (err, result) {
      app.send('groups:load', {
        offset: currentItemsCount,
        count: batchCount,
        response: result.response
      });
    });
  }

  var originalItems = appstate.get('groups').items;
  var items = data.response.items.map(Group);
  var groups = originalItems.splice.apply(originalItems, [data.offset, data.count].concat(items));

  return appstate.set('groups', {
    count: data.response.count,
    items: groups
  });
}

function loadTracks(vk, appstate, data, batchCount) {
  var currentItemsCount = appstate.get('tracks').items.count();

  if (currentItemsCount < data.response.count ) {
    fetchTracks(vk, appstate.get('user'), currentItemsCount, batchCount, function (err, result) {
      app.send('tracks:load', {
        offset: currentItemsCount,
        count: batchCount,
        response: result.response
      });
    });
  }

  var originalItems = appstate.get('tracks').items;
  var items = data.response.items.map(Track);
  var tracks = originalItems.splice.apply(originalItems, [data.offset, data.count].concat(items));

  return appstate.set('tracks', {
    count: data.response.count,
    items: tracks
  });
}

function loadWall(vk, appstate, groupId, callback) {
  vk.wall.get({
    owner_id: -groupId,
    offset: 0,
    count: 100,
    v: '5.25'
  }, callback);
}

function Vk(dbStream, receive, send, watch) {
  var vk = null;

  receive('vk:group-activity:fetched', function (appstate, group) {
    return appstate.update('groups', function (groups) {
      return {
        count: groups.count,
        items: groups.items.map(function (g) { // inefficient, take a look at sorted set data structure
          return g.id === group.id ? group : g;
        })
      };
    });
  });

  return function (appstate, type, data) {
    if (!Vk.isAuthenticated(appstate.get('user'))) {
      return appstate;
    }

    if (!vk) {
      vk = new VkApi({
        auth: {
          type: 'oauth',
          user: appstate.get('user').id,
          token: appstate.get('user').accessToken
        },

        rateLimit: 1
      });
    }

    // if (type === 'groups:load') {
    //   return loadGroups(vk, appstate, data, 100);
    // }

    if (type === 'tracks:load') {
      return loadTracks(vk, appstate, data, 1000);
    }

    if (appstate.get('groups').count === 0) {
      return fetchInitialData(vk, appstate);
    }

    var loadingActivities = appstate.get('loadingActivities');
    var groupsToLoadActivity = appstate
      .get('groups')
      .items
      .filter(_.negate(isEmpty))
      .filter(group => group.activity.total <= (group.postsTotal > 300 ? 300 : group.postsTotal))
      .filter(group => !loadingActivities.has(group.id));

    groupsToLoadActivity.forEach(function (group) {
      loadWall(vk, appstate, group.id, function (err, res) {
        if (err) {
          return console.log(err);
        }

        send('vk:group-activity:fetched', group.updateWall(res.response));
      });
    });

    return appstate.set('loadingActivities', loadingActivities.union(groupsToLoadActivity.map(g => g.id)));
  };
}

Vk.isAuthenticated = function isAuthenticated(user) {
  return user instanceof User.Authenticated;
};

Vk.makeAuthUrl = function makeAuthUrl(config) {
  return Url.format({
    host: Url.parse(config.AUTH_URL).host,
    pathname: Url.parse(config.AUTH_URL).pathname,
    query: {
      client_id: config.APP_ID,
      scope: config.PERMISSIONS.join(','),
      redirect_uri: config.REDIRECT_URI,
      display: config.DISPLAY,
      v: config.API_VERSION,
      response_type: 'token'
    }
  });
};

module.exports = Vk;