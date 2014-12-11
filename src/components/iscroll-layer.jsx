var React = require('react');
var IScroll = require('iscroll/build/iscroll');

var IScrollLayer = React.createClass({
  displayName: 'IScrollLayer',

  componentDidMount: function() {
    this.scroll = new IScroll(this.refs.view.getDOMNode(), {
      mouseWheel: true,
      scrollX: false
    });
  },

  componentDidUpdate: function () {
    this.scroll.refresh();
  },

  render: function() {
    return (
      <div class='scroll-wrapper' ref='view'>
        <div class='scroll-body'>{this.props.children}</div>
      </div>
    );
  }
});

module.exports = IScrollLayer;
