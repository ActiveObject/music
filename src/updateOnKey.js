import React from 'react';
import Kefir from 'kefir';
import db from 'app/db';
import onValue from 'app/onValue';

function updateOn(ComposedComponent, compare) {
  return React.createClass({
    componentDidMount: function () {
      var stream = Kefir.fromEvents(db, 'change').skipDuplicates(compare);
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

export default function updateOnKey(ComposedComponent, dbKey) {
  return updateOn(ComposedComponent, function (prevDb, nextDb) {
    if (Array.isArray(dbKey)) {
      return dbKey.every(function (key) {
        return prevDb.get(key) === nextDb.get(key);
      });
    }

    if (typeof dbKey === 'function') {
      return dbKey(prevDb) === dbKey(nextDb);
    }

    return prevDb.get(dbKey) === nextDb.get(dbKey);
  });
}