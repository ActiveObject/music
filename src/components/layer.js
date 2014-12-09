require('app/styles/layer.styl');

var React = require('react');

var Layer = React.createClass({
  render: function() {
    return React.DOM.div({ className: 'layer ' + this.props.className }, this.props.children);
  }
});

module.exports = Layer;
