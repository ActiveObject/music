import React from 'react';
import key from 'keymaster';
import { connect } from 'react-redux';

import { toggleTag } from 'app/shared/Tag';
import { rewind, forward, togglePlay } from 'app/shared/redux';

class KeyboardDriver extends React.Component {
  componentWillMount() {
    let { dispatch } = this.props;

    this.unsub = bindKeys(function (key) {
      key('left', function () {
        console.log(`[KeyboardDriver] rewind 5s`);
        dispatch(rewind(5000));
      });

      key('right', function () {
        console.log(`[KeyboardDriver] forward 5s`);
        dispatch(forward(5000));
      });

      key('space', function (event) {
        event.preventDefault();
        console.log(`[KeyboardDriver] toggle play`);
        dispatch(togglePlay());
      });
    });
  }

  componentWillUnmount() {
    this.unsub();
  }

  render() {
    return null;
  }
}

function bindKeys(fn) {
  var keyCombinations = [];

  fn(function (...args) {
    keyCombinations.push(args[0]);
    key(...args);
  });

  return function () {
    keyCombinations.forEach(x => key.unbind(x));
  };
}

export default connect()(KeyboardDriver);
