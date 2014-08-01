var React = require('react');

module.exports = React.createClass({
  render: function() {
    return React.DOM.div({ key: 'sidebar', className: 'sidebar-view' });
  }
});