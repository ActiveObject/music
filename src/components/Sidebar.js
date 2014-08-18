var React = require('react');

module.exports = React.createClass({
  displayName: 'Sidebar',

  render: function() {
    return React.DOM.div({ key: 'sidebar', className: 'sidebar-view' }, this.props.children);
  }
});