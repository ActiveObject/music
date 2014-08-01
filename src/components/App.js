var React = require('react');

module.exports = React.createClass({
  name: 'App',

  render: function() {
    return React.DOM.div({ className: 'app-container' }, this.props.children);
  }
});