var React = require('react');

module.exports = React.createClass({
  render: function() {
    return React.DOM.div({ id: this.props.id });
  }
});