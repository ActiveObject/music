var React = require('react');
var IScroll = require('iscroll');

module.exports = React.createClass({
  displayName: 'Sidebar',

  componentDidMount: function () {
    this.scroll = new IScroll(this.refs.view.getDOMNode(), {
      mouseWheel: true,
      scrollX: false
    });
  },

  componentDidUpdate: function () {
    this.scroll.refresh();
  },

  render: function() {
    return React.DOM.div({ className: 'scroll-wrapper sidebar-view', ref: 'view' },
      React.DOM.div({ className: 'sidebar-content' }, this.props.children)
    );
  }
});