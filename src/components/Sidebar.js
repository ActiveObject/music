var React = require('react');
var IScroll = require('iscroll');
var dom = require('app/core/dom');

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
    return dom.div()
      .className('scroll-wrapper sidebar-view')
      .attr('ref', 'view')
      .append(dom.div().className('sidebar-content').append(this.props.children))
      .make();
  }
});