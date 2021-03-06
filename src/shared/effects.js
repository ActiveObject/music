import React from 'react';
import ReactDOM from 'react-dom';

export class EffectComponent extends React.Component {
  perform(effect) {
    var node = ReactDOM.findDOMNode(this);
    var event = new CustomEvent(effect.type, {
      detail: effect,
      bubbles: true,
      cancelable: true
    });

    node.dispatchEvent(event);
  }
}

export class Effect extends EffectComponent {
  static defaultProps = {
    nowrap: false
  }

  run = effect => this.perform(effect)

  render() {
    if (this.props.nowrap) {
      return this.props.children(this.run);
    }

    return <div>{this.props.children(this.run)}</div>;
  }
}

export class EffectHandler extends React.Component {
  static propTypes = {
    type: React.PropTypes.string.isRequired,
    onEffect: React.PropTypes.func.isRequired
  }

  onEffect = event => this.props.onEffect(event.detail)

  componentWillMount() {
    document.addEventListener(this.props.type, this.onEffect, false);
  }

  componentWillUnmount() {
    document.removeEventListener(this.props.type, this.onEffect, false);
  }

  render() {
    return this.props.children;
  }
}
