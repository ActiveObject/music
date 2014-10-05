var React = require('react');

module.exports = React.createClass({
  displayName: 'Icon',

  shouldComponentUpdate: function (nextProps) {
    return nextProps.id !== this.props.id;
  },

  componentDidMount: function () {
    this.getDOMNode().appendChild(this.makeXlink(this.props.id));
  },

  componentDidUpdate: function () {
    this.getDOMNode()
      .querySelector('use')
      .setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + this.props.id);
  },

  render: function () {
    return React.DOM.svg({ className: 'icon', viewBox: '0 0 100 100' });
  },

  makeXlink: function (id) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    el.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + id);
    return el;
  }
});