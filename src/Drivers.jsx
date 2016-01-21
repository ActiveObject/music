import React from 'react';
import vkDriver from 'app/vk/driver';
import vkIndexerDriver from 'app/vk-indexer/driver';
import soundmanagerDriver from 'app/soundmanager/driver';
import localStorageDriver from 'app/local-storage-driver';
import keyControlDriver from 'app/key-control-driver';

class Drivers extends React.Component {
  componentDidMount() {
    this.subscriptions = [
      vkDriver(),
      vkIndexerDriver(),
      soundmanagerDriver(),
      localStorageDriver(),
      keyControlDriver()
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
  }

  render() {
    return <div />;
  }
}

export default Drivers;
