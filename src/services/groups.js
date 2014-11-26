var VkIndex = require('app/values/vk-index');
var db = require('app/core/db');
var vk = require('app/vk');

var vkIndex = new VkIndex({
  chunkSize: 100,
  transformFn: function (item, i) {
    var id = 'groups/' + item.id;

    return [
      [id, ':group/type', item.type],
      [id, ':group/name', item.name],
      [id, ':group/screen_name', item.screen_name],
      [id, ':group/photo_50', item.photo_50],
      [id, ':group/photo_100', item.photo_100],
      [id, ':group/photo_200', item.photo_200],
      [id, ':group/is_closed', Boolean(item.is_closed)],
      [id, ':group/is_admin', Boolean(item.is_admin)],
      [id, ':group/is_member', Boolean(item.is_member)],
      [id, ':group/vkid', item.id],
      [id, ':group/vk-index', i]
    ];
  },

  loadFn: function (user, chunkToLoad, callback) {
    vk.groups.get({
      user_id: user.id,
      offset: chunkToLoad.offset,
      count: chunkToLoad.count,
      extended: 1
    }, callback);
  }
});

vkIndex.on('load', function (index) {
  db.swap(db.value.update('groups', function (groups) {
    return groups.modify({ vkIndex: index });
  }));
});

module.exports = function (receive, send) {
  return function groupsService(appstate) {
    if (appstate.get('user').isAuthenticated() && !vkIndex.value.isBuilt && !vkIndex.value.isBuilding) {
      vkIndex.build(appstate.get('user'));
    }

    return appstate;
  };
};
