import React from 'react';
import { connect } from 'react-redux';
import app from 'app';
import vk from 'app/shared/vk';

class VkAudioSync extends React.Component {
  componentWillMount() {
    this.stopUpdating = startTrackUpdating(this.props.user, 10 * 1000);
  }

  render() {
    return <div />;
  }
}

function startTrackUpdating(user, interval) {
  var timer = null;

  function next() {
    updateTracks(user, () => {
      timer = setTimeout(() => next(), interval);
    });
  }

  next();

  return function () {
    clearTimeout(timer);
  };
}

function updateTracks(user, callback) {
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

export default connect(state => ({ user: state.user }))(VkAudioSync);
