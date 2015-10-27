import { EventEmitter } from 'events';
import ReactDOM from 'react-dom';
import React from 'react';

var renderQueue = new EventEmitter();
renderQueue.setMaxListeners(1000);

export function render(RootView, targetEl) {
  var isFirstRun = true;

  return function (appstate) {
    if (isFirstRun) {
      ReactDOM.render(<RootView />, targetEl);
      isFirstRun = false;
    }

    renderQueue.emit('render', appstate);

    return appstate;
  };
}

export function updateOn(ComposedComponent, ...dbKeys) {
  return updateOnDbChange(ComposedComponent, function (prevDb, nextDb) {
    return dbKeys.every(equalsByGivenKey(prevDb, nextDb));
  });
}

function updateOnDbChange(ComposedComponent, equals) {
  return React.createClass({
    componentDidMount: function () {
      var prevDbVal = null;

      this.unsub = addListener(renderQueue, 'render', nextDbVal => {
        if (!prevDbVal) {
          prevDbVal = nextDbVal;
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
    emitter.removeListener();
  };
}
