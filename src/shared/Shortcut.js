import React, { Component, PropTypes } from 'react';
import key from 'keymaster';

export default class Shortcut extends Component {
  static propTypes = {
    bindTo: PropTypes.string.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    preventDefault: PropTypes.bool
  }

  defaultProps = {
    preventDefault: false
  }

  componentDidMount() {
    var { bindTo, preventDefault, onKeyDown } = this.props;

    this.unbind = bindKeys(key => {
      key(bindTo, event => {
        if (preventDefault) {
          event.preventDefault();
        }

        onKeyDown(event);
      });
    })
  }

  componentWillUnmount() {
    this.unbind();
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
