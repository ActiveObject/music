var Url = require('url');
var Auth = require('app/core/auth');
var router = require('app/core/router');
var AuthRoute = require('app/routes/auth-route');
var User = require('app/values/user');
var eventBus = require('app/core/event-bus');
var accounts = require('app/accounts');

var vkAuthUrl = Url.format({
  protocol: Url.parse(accounts.vk.AUTH_URL).protocol,
  host: Url.parse(accounts.vk.AUTH_URL).host,
  pathname: Url.parse(accounts.vk.AUTH_URL).pathname,
  query: {
    client_id: accounts.vk.APP_ID,
    scope: accounts.vk.PERMISSIONS.join(','),
    redirect_uri: 'https://' + process.env.MUSIC_CHROME_APP_ID + '.chromiumapp.org/vk',
    display: accounts.vk.DISPLAY,
    v: accounts.vk.API_VERSION,
    response_type: 'token'
  }
});

module.exports = function (receive) {
  receive(':app/started', function(appstate) {
    chrome.identity.launchWebAuthFlow({
      url: vkAuthUrl,
      interactive: true
    }, function(redirectUrl) {
      if (!redirectUrl) {
        throw new Error(chrome.runtime.lastError.message);
      }

      try {
        eventBus.push({ e: 'app', a: ':app/user', v: Auth.readFromUrl(redirectUrl) });
      } catch (e) {
        console.log(e);
      }
    });

    return appstate.set('user', new User.Unauthenticated());
  });

  receive(':app/user', function (appstate, user) {
    return appstate.set('user', user);
  });
};
