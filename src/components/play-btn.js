var React = require('react');
var Icon = require('app/components/icon');

module.exports = React.createClass({
  render: function () {
    var icon = new Icon({
      id: this.props.isPlaying ? 'shape-pause' : 'shape-iconmonstr-arrow-37-icon',
      onClick: this.props.onClick
    });

    return React.DOM.div({
      key: 'play-btn',
      className: 'play-btn' + (this.props.isPlaying ? ' active' : ''),
      onClick: this.props.onClick
    }, icon);
  }
});