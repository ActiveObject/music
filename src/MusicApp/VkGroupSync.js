import React from 'react';
import { EffectComponent } from 'app/shared/effects';

export default class VkGroupSync extends EffectComponent {
  componentDidMount() {
    console.log(`[VkGroupSync] start syncing groups every ${this.props.interval}s`);
    this.stopSyncing = this.startSyncing();
  }

  componentWillUnmount() {
    this.stopSyncing();
  }

  startSyncing() {
    var timer = null;
    var { userId, vk, interval, onSync } = this.props;

    var sync = () => {
      var effect = vk.groups.get({}, (err, res) => {
        if (err) {
          return console.log(err);
        }

        onSync(res.response.items.map(String));
      });

      this.perform(effect);

      timer = setTimeout(sync, interval * 1000);
    }

    sync();

    return function () {
      clearTimeout(timer);
    };
  }

  render() {
    return <div></div>;
  }
}
