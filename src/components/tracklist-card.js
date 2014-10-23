var React = require('react');
var IScroll = require('iscroll');
var debug = require('debug')('app:tracklist-card');
var dom = require('app/core/dom');

module.exports = React.createClass({
  displayName: 'TracklistCard',

  propTypes: {
    activeTrack: React.PropTypes.component.isRequired,
    tracklist: React.PropTypes.component.isRequired,
    name: React.PropTypes.string
  },

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
    var name = dom.div()
      .key('section')
      .className('tracklist-section-name')
      .append(this.props.name + ' (1243)');

    var tracklist = dom.div()
      .className('tracklist')
      .append(name, this.props.tracklist)
      .make();

    var list = dom.div()
      .className('scroll-wrapper')
      .attr('ref', 'view')
      .append(tracklist)
      .make();

    return dom.div()
      .className('tracklist-card')
      .append(list)
      .append(this.props.activeTrack)
      .make();
  }
});