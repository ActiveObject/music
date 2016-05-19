import { EventEmitter } from 'events';
import React from 'react';
import Atom from 'app/shared/Atom';

var AppContext = React.createClass({
  contextTypes: {
    changeEmitter: React.PropTypes.instanceOf(EventEmitter)
  },

  componentWillMount() {
    Atom.listen(this.props.value, () => this.context.changeEmitter.emit('render'));
  },

  render() {
    return this.props.children;
  }
});

export default React.createClass({
  childContextTypes: {
    changeEmitter: React.PropTypes.instanceOf(EventEmitter)
  },

  getChildContext() {
    var changeEmitter = new EventEmitter();
    changeEmitter.setMaxListeners(1000);
    return { changeEmitter };
  },

  render() {
    return (
      <AppContext value={this.props.value}>
        {this.props.children}
      </AppContext>
    );
  }
});

export function updateOn(ComposedComponent, ...dbKeys) {
  return updateOnDbChange(ComposedComponent, function (prevDb, nextDb) {
    return dbKeys.every(equalsByGivenKey(prevDb, nextDb));
  });
}

function updateOnDbChange(ComposedComponent, equals) {
  return React.createClass({
    contextTypes: {
      changeEmitter: React.PropTypes.instanceOf(EventEmitter)
    },

    componentWillMount: function () {
      var prevDbVal = null;

      this.unsub = addListener(this.context.changeEmitter, 'render', nextDbVal => {
        if (!prevDbVal) {
          prevDbVal = nextDbVal;
          this.forceUpdate();
          return;
        }

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

function addListener(emitter, event, listener) {
  function handleEvent(...args) {
    listener(...args);
  }

  emitter.addListener(event, handleEvent);

  return function () {
    emitter.removeListener(event, handleEvent);
  };
}
