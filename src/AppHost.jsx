import { EventEmitter } from 'events';
import React from 'react';
import Atom from 'app/shared/Atom';

var AppContext = React.createClass({
  contextTypes: {
    changeEmitter: React.PropTypes.instanceOf(EventEmitter)
  },

  componentWillMount() {
    this.unsub = this.subscribe();
  },

  componentWillUpdate() {
    this.unsub();
    this.unsub = this.subscribe();
  },

  componentWillUnmount() {
    this.unsub();
  },

  subscribe() {
    return Atom.listen(this.props.value, dbVal => this.context.changeEmitter.emit('render', dbVal));
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
      this.prevDbVal = null;
      this.unsub = this.subscribe(this.context.changeEmitter);
    },

    componentWillUpdate(nextProps, nextState, nextContext) {
      if (this.context.changeEmitter !== nextContext.changeEmitter) {
        this.unsub();
        this.unsub = this.subscribe(nextContext.changeEmitter);
      }
    },

    componentWillUnmount: function () {
      this.unsub();
    },

    subscribe(emitter) {
      return addListener(emitter, 'render', nextDbVal => {
        if (!this.prevDbVal) {
          this.prevDbVal = nextDbVal;
          this.forceUpdate();
          return;
        }

        if (!equals(this.prevDbVal, nextDbVal)) {
          this.prevDbVal = nextDbVal;
          this.forceUpdate();
        }
      });
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
