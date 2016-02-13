import React from 'react';
import { omit } from 'underscore';
import app from 'app';
import subscribeWith from 'app/subscribeWith';
import emitterOn from 'app/emitterOn';
import { updateOn } from 'app/renderer';
import { hasTag, removeTag } from 'app/Tag';
import merge from 'app/merge';
import driver from './driver';

class Soundmanager extends React.Component {
  componentWillMount() {
    driver.setup({ debugMode: false });

    this.unsub = subscribeWith(emitterOn, (on) => {
      on(driver, 'whileplaying', (position) => {
        if (!app.value.get(':db/player').seeking) {
          app.push(merge(app.value.get(':db/player'), { position: position }));
        }
      })

      on(driver, 'whileloading', (bytesLoaded, bytesTotal) => {
        app.push(merge(app.value.get(':db/player'), { bytesLoaded, bytesTotal }));
      })

      on(driver, 'error', (err) => {
        console.log(err);
      });
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

    driver.tick(player);
  }

  render() {
    return <div />;
  }
}

export default updateOn(Soundmanager, ':db/player');
