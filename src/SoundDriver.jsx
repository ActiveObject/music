import React from 'react';
import { omit } from 'underscore';
import app from 'app';
import sm from 'app/soundmanager';
import { updateOn } from 'app/renderer';
import subscribeWith from 'app/subscribeWith';
import onValue from 'app/onValue';
import * as Player from 'app/Player';
import { hasTag, removeTag } from 'app/Tag';
import merge from 'app/merge';
import vk from 'app/vk';

class SoundDriver extends React.Component {
  componentWillMount() {
    sm.setup({
      url: 'swf',
      flashVersion: 9,
      preferFlash: false,
      debugMode: false
    });

    this.unsubscribe = subscribeWith(on, onValue, (on, onValue) => {
      on(sm, 'finish', function (track) {
        app.push(Player.play(Player.nextTrack(app.value.get(':db/player'))));
      });

      on(sm, 'whileplaying', function (position) {
        if (!app.value.get(':db/player').seeking) {
          app.push(merge(app.value.get(':db/player'), { position: position }));
        }
      });

      on(sm, 'whileloading', function (bytesLoaded, bytesTotal) {
        app.push(merge(app.value.get(':db/player'), { bytesLoaded, bytesTotal }));
      });

      on(sm, 'error', function (err) {
        vk.audio.getById({
          audios: [`${err.track.owner}_${err.track.id}`]
        }, function (err, res) {
          if (err) {
            return console.log(err);
          }

          app.push({ tag: ':vk/tracks', tracks: res.response });
        });
      });
    });
  }

  componentDidUpdate() {
    var player = app.value.get(':db/player');

    if (hasTag(player, ':player/seek-to-position')) {
      app.push(merge(omit(removeTag(player, ':player/seek-to-position'), 'seekToPosition'), {
        position: player.seekToPosition
      }));
    }

    sm.tick(player);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return <div />;
  }
}

function on(emitter, event, fn) {
  emitter.on(event, fn);

  return function() {
    emitter.removeListener(event, fn);
  };
}

export default updateOn(SoundDriver, ':db/player');
