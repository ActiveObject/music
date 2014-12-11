require('app/styles/main.styl');
require('app/styles/two-region.styl');

var _ = require('underscore');
var React = require('react/addons');
var cx = React.addons.classSet;

module.exports = React.createClass({
  displayName: 'App',

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