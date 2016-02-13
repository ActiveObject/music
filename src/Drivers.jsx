import React from 'react';
import localStorageDriver from 'app/local-storage-driver';
import keyControlDriver from 'app/key-control-driver';
import VkDriver from 'app/VkDriver';
import VkIndexerDriver from 'app/VkIndexerDriver';

class Drivers extends React.Component {
  componentDidMount() {
    this.subscriptions = [
      localStorageDriver(),
      keyControlDriver()
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
  }

  render() {
    return (
      <div>
        <VkDriver />
        <VkIndexerDriver />
      </div>
    );
  }
}

export default Drivers;
