import React from 'react';
import omit from 'lodash/omit';
import { connect } from 'react-redux';
import app from 'app';
import subscribeWith from 'app/shared/subscribeWith';
import emitterOn from 'app/shared/emitterOn';
import { hasTag, removeTag } from 'app/shared/Tag';
import merge from 'app/shared/merge';
import SoundDriver from './SoundDriver';
import vk from 'app/shared/vk';
import * as Player from 'app/shared/Player';
import { toString } from 'app/shared/Track';
import { updatePosition, updateLoading, nextTrack, play } from 'app/playerActions';

class Soundmanager extends React.Component {
  componentWillMount() {
    SoundDriver.setup({ debugMode: false });

    this.unsub = subscribeWith(emitterOn, (on) => {
      on(SoundDriver, 'whileplaying', (position) => {
        if (!this.props.player.seeking) {
          this.props.dispatch(updatePosition(position));
        }
      });

      on(SoundDriver, 'whileloading', (bytesLoaded, bytesTotal) => {
        this.props.dispatch(updateLoading(bytesLoaded, bytesTotal));
      });

      on(SoundDriver, 'finish', () => {
        this.props.dispatch(nextTrack());
        this.props.dispatch(play());
      });

      on(SoundDriver, 'error', err => reload(err.track, this.props.dispatch));
    });
  }

  componentWillUnmount() {
    this.unsub();
  }

  componentWillUpdate({ player }) {
    if (hasTag(player, ':player/seek-to-position')) {
      app.push(merge(omit(removeTag(player, ':player/seek-to-position'), 'seekToPosition'), {
        position: player.seekToPosition
      }));
    }

    SoundDriver.tick(player);
  }

  render() {
    return <div />;
  }
}

function reload(track) {
  console.log(`[TrackCtrl] fetch url for ${toString(track)}`);

  fetchUrl(track, (err, res) => {
    if (err) {
      return console.log(err);
    }

    app.push(
      Player.play(
        Player.useTrack(this.props.player, merge(track, {
          url: res.response[0]
        }))));
  });
}

function fetchUrl(audio, callback) {
  vk.execute({
    code: `
      return API.audio.getById({ audios: "${audio.owner}_${audio.id}" })@.url;
    `
  }, callback);
}

export default connect((state) => {
  return {
    player: state
  };
})(Soundmanager);
