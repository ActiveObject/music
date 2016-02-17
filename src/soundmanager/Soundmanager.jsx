import React from 'react';
import omit from 'lodash/omit';
import app from 'app';
import subscribeWith from 'app/subscribeWith';
import emitterOn from 'app/emitterOn';
import { updateOn } from 'app/renderer';
import { hasTag, removeTag } from 'app/Tag';
import merge from 'app/merge';
import SoundDriver from './SoundDriver';
import vk from 'app/vk';
import * as Player from 'app/Player';
import { toString } from 'app/Track';

class Soundmanager extends React.Component {
  componentWillMount() {
    SoundDriver.setup({ debugMode: false });

    this.unsub = subscribeWith(emitterOn, (on) => {
      on(SoundDriver, 'whileplaying', (position) => {
        if (!app.value.get(':db/player').seeking) {
          app.push(merge(app.value.get(':db/player'), { position: position }));
        }
      })

      on(SoundDriver, 'whileloading', (bytesLoaded, bytesTotal) => {
        app.push(merge(app.value.get(':db/player'), { bytesLoaded, bytesTotal }));
      })

      on(SoundDriver, 'error', err => reload(err.track));
    });
  }

  componentWillUnmount() {
    this.unsub();
  }

  componentWillUpdate() {
    var player = app.value.get(':db/player');

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
        Player.useTrack(app.value.get(':db/player'), merge(track, {
          url: res.response
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

export default updateOn(Soundmanager, ':db/player');
