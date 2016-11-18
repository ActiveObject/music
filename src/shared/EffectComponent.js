import React from 'react';
import ReactDOM from 'react-dom';

export default class EffectComponent extends React.Component {
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
