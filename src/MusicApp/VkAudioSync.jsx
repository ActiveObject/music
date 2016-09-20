import React from 'react';
import { connect } from 'react-redux';
import vk from 'app/shared/vk';
import { pushLibrary } from 'app/actions';

class VkAudioSync extends React.Component {
  componentWillMount() {
    this.stopUpdating = startTrackUpdating(this.props.user, 10 * 1000, res => {
      this.props.dispatch(pushLibrary(res.response.map(t => {
        return {
          tag: ':track-source/library',
          trackId: String(t)
        }
      })));
    });
  }

  render() {
    return <div />;
  }
}

function startTrackUpdating(user, interval, callback) {
  var timer = null;

  function next() {
    updateTracks(user, res => {
      callback(res);
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

export default connect(state => ({ user: state.user }))(VkAudioSync);
