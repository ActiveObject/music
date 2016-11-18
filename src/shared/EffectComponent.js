import React from 'react';
import ReactDOM from 'react-dom';

export default class EffectComponent extends React.Component {
  perform(effect) {
    var node = ReactDOM.findDOMNode(this);
    var event = new CustomEvent("vk-request", {
      detail: effect,
      bubbles: true,
      cancelable: true
    });

    node.dispatchEvent(event);
  }
}
