var React = require('react');
var Impulse = require('impulse');
var _ = require('underscore');
var Icon = React.createFactory(require('app/components/icon'));
var dom = require('app/core/dom');

module.exports = React.createClass({
  displayName: 'PlayBtn',

  shouldComponentUpdate: function (nextProps) {
    return !_.isEqual(nextProps, this.props);
  },

  componentDidMount: function() {
    this.rotate = Impulse(this.getDOMNode()).style('rotate', function(x, y) {
      return x + 'deg';
    });

    this.rotate.position(this.props.isActive ? 90 : 0);
  },

  componentDidUpdate: function (prevProps) {
    if (this.props.isActive && !prevProps.isActive) {
      this.rotate.spring({ tension: 200, damping: 15 })
        .from(0)
        .to(90).start();
    }

    if (!this.props.isActive && prevProps.isActive) {
      this.rotate.spring({ tension: 200, damping: 15 })
        .from(90)
        .to(0).start();
    }
  },

  render: function () {
    var icon = new Icon({
      id: this.props.isPlaying ? 'shape-pause' : 'shape-iconmonstr-arrow-37-icon'
    });

    return dom.div()
      .key('play-btn')
      .className('play-btn')
      .className('active', this.props.isActive)
      .attr('onClick', this.props.onClick)
      .append(icon)
      .make();
  }
});