var jsonpRequest = require('jsonp');

function xhrRequest(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      var body;

      try {
        body = JSON.parse(xhr.responseText);
      } catch (e) {
        return callback(e);
      }

      callback(null, body);
    }
  };

  return xhr.send();
}

module.exports = chrome && chrome.identity ? xhrRequest : jsonpRequest;
