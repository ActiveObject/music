import React from 'react';

export default class VkAudioSync extends React.Component {
  componentWillMount() {
    console.log(`[VkAudioSync] start syncing audio every ${this.props.interval}s`);
    this.stopSyncing = this.startSyncing();
  }

  componentWillUnmount() {
    console.log(`[VkAudioSync] stop syncing`);
    this.stopSyncing();
  }

  startSyncing(interval) {
    var timer = null;
    var { vk, userId, onSync, interval } = this.props;

    function sync() {
      vk.execute({
        code: `
        return API.audio.get({ owner_id: ${userId} }).items@.id;
        `
      }, (err, res) => {
        if (err) {
          return console.log(err);
        }

        var library = res.response.map(t => {
          return {
            tag: ':track-source/library',
            trackId: String(t)
          }
        });

        onSync(library);

        timer = setTimeout(sync, interval * 1000);
      });
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
