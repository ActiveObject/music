import React from 'react';
import keyControlDriver from 'app/key-control-driver';

class Drivers extends React.Component {
  componentDidMount() {
    this.subscriptions = [
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
