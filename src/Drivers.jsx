import React from 'react';
import vkIndexerDriver from 'app/vk-indexer/driver';
import soundmanagerDriver from 'app/soundmanager/driver';
import localStorageDriver from 'app/local-storage-driver';
import keyControlDriver from 'app/key-control-driver';
import VkDriver from 'app/VkDriver';

class Drivers extends React.Component {
  componentDidMount() {
    this.subscriptions = [
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
    return <VkDriver />;
  }
}

export default Drivers;
