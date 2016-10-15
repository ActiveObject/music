import React from 'react';
import vk from 'app/shared/vk';

class VkAudioSync extends React.Component {
  componentWillMount() {
    var { userId, onSync } = this.props;

    this.stopUpdating = startTrackUpdating(userId, 10 * 1000, res => {
      onSync(res.response.map(t => {
        return {
          tag: ':track-source/library',
          trackId: String(t)
        }
      }));
    });
  }

  render() {
    return null;
  }
}

function startTrackUpdating(userId, interval, callback) {
  var timer = null;

  function next() {
    updateTracks(userId, res => {
      callback(res);
      timer = setTimeout(() => next(), interval);
    });
  }

  next();

  return function () {
    clearTimeout(timer);
  };
}

function updateTracks(userId, callback) {
  loadAllAudioIds(userId, (err, res) => {
    if (err) {
      return console.log(err);
    }

    callback(res);
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
