var Url = require('url');
var VError = require('verror');
var Auth = require('app/core/auth');
var router = require('app/core/router');
var AuthRoute = require('app/routes/auth-route');
var vbus = require('app/core/vbus');
var vk = require('app/values/accounts/vk');

var vkAuthUrl = Url.format({
  protocol: Url.parse(vk.AUTH_URL).protocol,
  host: Url.parse(vk.AUTH_URL).host,
  pathname: Url.parse(vk.AUTH_URL).pathname,
  query: {
    client_id: vk.APP_ID,
    scope: vk.PERMISSIONS.join(','),
    redirect_uri: 'https://' + process.env.MUSIC_CHROME_APP_ID + '.chromiumapp.org/vk',
    display: vk.DISPLAY,
    v: vk.API_VERSION,
    response_type: 'token'
  }
});

chrome.identity.launchWebAuthFlow({
  url: vkAuthUrl,
  interactive: true
}, function(redirectUrl) {
  if (!redirectUrl) {
    throw new VError(
      'Authentication failed: %s \n' +
      'Chrome App id: %s, check if it is the id of published app.',
      chrome.runtime.lastError.message,
      process.env.MUSIC_CHROME_APP_ID
    );
  }

  try {
    vbus.emit(Auth.readFromUrl(redirectUrl));
  } catch (e) {
    console.log(e);
  }
});

vbus.emit({ tag: ':app/user' });
