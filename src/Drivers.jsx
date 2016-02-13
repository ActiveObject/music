import React from 'react';
import localStorageDriver from 'app/local-storage-driver';
import keyControlDriver from 'app/key-control-driver';

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
      <div />
    );
  }
}

export default Drivers;
