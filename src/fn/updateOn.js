import React from 'react';
import db from 'app/db';
import onValue from 'app/fn/onValue';

export default function updateOn(ComposedComponent, transform) {
  return React.createClass({
    componentDidMount: function () {
      var stream = db.changes.map(transform).skipDuplicates();
      this.unsub = onValue(stream, () => this.forceUpdate());
    },

    componentWillUnmount: function () {
      this.unsub();
    },

    render: function () {
      return React.createElement(ComposedComponent, this.props);
    }
  });
}