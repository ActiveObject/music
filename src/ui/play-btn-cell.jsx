var React = require('react');
var Icon = require('app/ui/icon');
var cx = require('classnames');

var PlayBtnCell = React.createClass({
  render: function () {
    var classes = cx({
      'play-btn-cell': true,
      'play-btn-cell--active': this.props.isActive
    });

    return (
      <div className={classes} onClick={this.props.onClick}>
        <Icon id={this.props.isPlaying ? 'shape-pause' : 'shape-iconmonstr-arrow-37-icon'}></Icon>
      </div>
    );
  }
});

module.exports = PlayBtnCell;
