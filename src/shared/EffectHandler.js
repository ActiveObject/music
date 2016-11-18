import React from 'react';

export default class EffectHandler extends React.Component {
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
