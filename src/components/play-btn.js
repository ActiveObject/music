var React = require('react');
var Icon = require('app/components/icon');
var dom = require('app/core/dom');

module.exports = React.createClass({
  displayName: 'PlayBtn',

  render: function () {
    var icon = new Icon({
      id: this.props.isPlaying ? 'shape-pause' : 'shape-iconmonstr-arrow-37-icon',
      onClick: this.props.onClick
    });

    return dom.div()
      .key('play-btn')
      .className('play-btn')
      .className('active', this.props.isPlaying)
      .attr('onClick', this.props.onClick)
      .append(icon)
      .make();
  }
});