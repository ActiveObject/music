import React from 'react';
import app from 'app';
import Atom from 'app/Atom';

function updateOnDbChange(ComposedComponent, equals) {
  return React.createClass({
    componentDidMount: function () {
      var prevDbVal = app.value;

      this.unsub = Atom.listen(app, nextDbVal => {
        if (!equals(prevDbVal, nextDbVal)) {
          prevDbVal = nextDbVal;
          this.forceUpdate();
        }
      });
    },

    componentWillUnmount: function () {
      this.unsub();
    },

    render: function () {
      return React.createElement(ComposedComponent, this.props);
    }
  });
}

function equalsByGivenKey(prevDb, nextDb) {
  return function equals(dbKey) {
    if (Array.isArray(dbKey)) {
      return dbKey.every(function (key) {
        return prevDb.get(key) === nextDb.get(key);
      });
    }

    if (typeof dbKey === 'function') {
      return dbKey(prevDb) === dbKey(nextDb);
    }

    return prevDb.get(dbKey) === nextDb.get(dbKey);
  };
}

export default function updateOn(ComposedComponent, ...dbKeys) {
  return updateOnDbChange(ComposedComponent, function (prevDb, nextDb) {
    return dbKeys.every(equalsByGivenKey(prevDb, nextDb));
  });
}