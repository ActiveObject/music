import React from 'react';
import omit from 'lodash/omit';
import app from 'app';
import subscribeWith from 'app/shared/subscribeWith';
import emitterOn from 'app/shared/emitterOn';
import { updateOn } from 'app/StartApp';
import { hasTag, removeTag } from 'app/shared/Tag';
import merge from 'app/shared/merge';
import SoundDriver from './SoundDriver';
import vk from 'app/shared/vk';
import * as Player from 'app/shared/Player';
import { toString } from 'app/shared/Track';

class Soundmanager extends React.Component {
  componentWillMount() {
    SoundDriver.setup({ debugMode: false });

    this.unsub = subscribeWith(emitterOn, (on) => {
      on(SoundDriver, 'whileplaying', (position) => {
        if (!app.value.get(':db/player').seeking) {
          app.push(merge(app.value.get(':db/player'), { position: position }));
        }
      });

      on(SoundDriver, 'whileloading', (bytesLoaded, bytesTotal) => {
        app.push(merge(app.value.get(':db/player'), { bytesLoaded, bytesTotal }));
      });

      on(SoundDriver, 'finish', () => {
        app.push(
          Player.play(
            Player.nextTrack(app.value.get(':db/player'))));
      });

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

export default updateOn(Soundmanager, ':db/player');
