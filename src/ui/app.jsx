var _ = require('underscore');
var React = require('react');
var cx = require('classnames');

var App = React.createClass({
  render: function() {
    var layout = [].concat(this.props.layout);

    var classes = cx({
      'app-container': true,
      'two-region': _.contains(this.props.layout, 'two-region'),
      'main-layout': _.contains(this.props.layout, 'main-layout'),
      'group-layout': _.contains(this.props.layout, 'group-layout'),
      'artist-layout': _.contains(this.props.layout, 'artist-layout')
    });

    return <div className={classes}>{this.props.children}</div>;
  }
});

module.exports = App;
