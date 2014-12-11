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
    var body = React.DOM.div({ className: 'scroll-body' }, this.props.children);
    return React.DOM.div({ className: 'scroll-wrapper', ref: 'view' }, body);
  }
});

module.exports = IScrollLayer;
