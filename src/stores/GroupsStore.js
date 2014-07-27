module.exports = function(config, listen) {
  var api = new Vk(config);

  return listen('user', function(user) {
    return api.get('groups', {
      user: user.id
    });
  });
};