require('app/styles/main.styl');

var React = require('react');
var dom = require('app/core/dom');

module.exports = React.createClass({
  displayName: 'App',

  render: function() {
    return dom.div().className('app-container').append(this.props.children).make();
  }
});