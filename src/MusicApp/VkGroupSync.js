import React from 'react';

export default class VkGroupSync extends React.Component {
  componentWillMount() {
    console.log(`[VkGroupSync] start syncing groups every ${this.props.interval}s`);
    this.stopSyncing = this.startSyncing();
  }

  componentWillUnmount() {
    this.stopSyncing();
  }

  startSyncing() {
    var timer = null;
    var { userId, vk, interval, onSync } = this.props;

    function sync() {
      vk.groups.get({}, (err, res) => {
        if (err) {
          return console.log(err);
        }

        onSync(res.response.items.map(String));
      });

      timer = setTimeout(sync, interval * 1000);
    }

    sync();

    return function () {
      clearTimeout(timer);
    };
  }

  render() {
    return null;
  }
}
