import React from 'react';
import db from 'app/db';
import onValue from 'app/fn/onValue';

export default function updateOn(ComposedComponent, compare) {
  return React.createClass({
    componentDidMount: function () {
      var stream = db.changes.skipDuplicates(compare);
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