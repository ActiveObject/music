var React = require('react');
var Layout = require('app/core/Layout');

var App = React.createClass({
  render: function() {
    return Layout.make(this.props.layout);
  }
});

module.exports = AppView;