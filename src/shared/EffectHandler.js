import React from 'react';

export default class EffectHandler extends React.Component {
  static propTypes = {
    type: React.PropTypes.string.isRequired,
    onEffect: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    document.addEventListener(this.props.type, event => this.props.onEffect(event), false);
  }

  render() {
    return this.props.children;
  }
}
