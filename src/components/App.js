var React = require('react');

module.exports = React.createClass({
  displayName: 'App',

  render: function() {
    return React.DOM.div({ className: 'app-container' }, this.props.children);
  }
});