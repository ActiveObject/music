import React from 'react';
import app from 'app';
import vk from 'app/vk';

class VkIndexerDriver extends React.Component {
  componentWillMount() {
    this.stopUpdating = startTrackUpdating(2 * 60 * 1000);
  }

  render() {
    return <div />;
  }
}

function startTrackUpdating(interval) {
  var timer = null;

  function next() {
    updateTracks();
    timer = setTimeout(() => next(), interval);
  }

  next();

  return function () {
    clearTimeout(timer);
  };
}

function updateTracks() {
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
  });
}

function loadAllAudioIds(owner, callback) {
  vk.execute({
    code: `
      return API.audio.get({ owner_id: ${owner} }).items@.id;
    `
  }, callback);
}

export default VkIndexerDriver;
