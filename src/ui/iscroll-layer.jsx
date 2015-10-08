var React = require('react');
var IScroll = require('iscroll/build/iscroll');

var IScrollLayer = React.createClass({
  componentDidMount: function() {
    this.scroll = new IScroll(this.refs.view, {
      mouseWheel: true,
      scrollX: false
    });

    this.interval = setInterval(() => this.scroll.refresh(), 100);
  },

  componentWillUnmount: function () {
    clearInterval(this.interval);
  },

  componentDidUpdate: function () {
    this.scroll.refresh();
  },

  render: function() {
    return (
      <div className='scroll-wrapper' ref='view'>
        <div className='scroll-body'>{this.props.children}</div>
      </div>
    );
  }
});

module.exports = IScrollLayer;
