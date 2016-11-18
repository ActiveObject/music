import React from 'react';
import ReactDOM from 'react-dom';

export class EffectComponent extends React.Component {
  perform({ type, detail }) {
    var node = ReactDOM.findDOMNode(this);
    var event = new CustomEvent(type, {
      detail,
      bubbles: true,
      cancelable: true
    });

    node.dispatchEvent(event);
  }
}

export class EffectHandler extends React.Component {
  static propTypes = {
    type: React.PropTypes.string.isRequired,
    onEffect: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    document.addEventListener(this.props.type, this.props.onEffect, false);
  }

  componentWillUnmount() {
    document.removeEventListener(this.props.type, this.props.onEffect, false);
  }

  render() {
    return this.props.children;
  }
}
