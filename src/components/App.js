var React = require('react');
var Layout = require('app/core/Layout');

var App = React.createClass({
  render: function() {
    return React.DOM.div({ className: 'app-container' }, Layout.make(this.props.layout, this.props));
  }
});

module.exports = App;