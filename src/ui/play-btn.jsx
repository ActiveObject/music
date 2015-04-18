var React = require('react/addons');
var Impulse = require('impulse');
var Icon = require('app/ui/icon');
var cx = require('classnames');

var PlayBtn = React.createClass({
  mixins: [React.addons.PureRenderMixin],

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
    var classes = cx({
      'play-btn': true,
      'active': this.props.isActive
    });

    return (
      <div key='play-btn' className={classes} onClick={this.props.onClick}>
        <Icon id={this.props.isPlaying ? 'shape-pause' : 'shape-iconmonstr-arrow-37-icon'}></Icon>
      </div>
    );
  }
});

module.exports = PlayBtn;
