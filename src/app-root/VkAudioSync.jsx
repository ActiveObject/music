import React from 'react';
import app from 'app';
import vk from 'app/shared/vk';

class VkAudioSync extends React.Component {
  componentWillMount() {
    this.stopUpdating = startTrackUpdating(10 * 1000);
  }

  render() {
    return <div />;
  }
}

function startTrackUpdating(interval) {
  var timer = null;

  function next() {
    updateTracks(() => {
      timer = setTimeout(() => next(), interval);
    });
  }

  next();

  return function () {
    clearTimeout(timer);
  };
}

function updateTracks(callback) {
  var user = app.value.get(':db/user');

  loadAllAudioIds(user.id, (err, res) => {
    if (err) {
      return console.log(err);
    }

    app.push({
      tag: ':app/library',
      value: res.response.map(t => {
        return {
          tag: ':track-source/library',
          trackId: String(t)
        }
      })
    });

    callback(err, res);
  });
}

function loadAllAudioIds(owner, callback) {
  vk.execute({
    code: `
      return API.audio.get({ owner_id: ${owner} }).items@.id;
    `
  }, callback);
}

export default VkAudioSync;
