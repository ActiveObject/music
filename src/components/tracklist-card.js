var _ = require('underscore');
var React = require('react');
var IScroll = require('iscroll/build/iscroll-probe');
var debug = require('debug')('app:tracklist-card');
var dom = require('app/core/dom');
var Tracklist = require('app/components/tracklist');
var ActiveTrack = require('app/components/active-track');
var TrackModel = require('app/models/track');

module.exports = React.createClass({
  displayName: 'TracklistCard',

  propTypes: {
    activeTrack: React.PropTypes.object.isRequired,
    tracks: React.PropTypes.object.isRequired,
    name: React.PropTypes.string
  },

  getInitialState: function () {
    return { y: 0 };
  },

  getDefaultProps: function () {
    return {
      itemHeight: 40 + 20
    };
  },

  componentDidMount: function () {
    var component = this;

    this.scroll = new IScroll(this.refs.view.getDOMNode(), {
      mouseWheel: true,
      scrollX: false,
      probeType: 3
    });

    this.scroll.on('scroll', _.throttle(function () {
      component.setState({ y: this.y });
    }), 1000);
  },

  componentDidUpdate: function (prevProps) {
    if (this.props.tracks !== prevProps.tracks) {
      this.scroll.refresh();
    }
  },

  render: function() {
    var name = dom.div()
      .key('section')
      .className('tracklist-section-name')
      .append(this.props.name + ' (1243)');

    var visibleRange = this.getVisibleRange();

    var tracks = this.props.tracks
      .slice(visibleRange[0], visibleRange[1])
      .filter(_.negate(TrackModel.isEmpty))
      .toJS()
      .map(function (track, i) {
        return {
          yOffset: (i + visibleRange[0]) * this.props.itemHeight,
          value: track
        };
      }, this);

    var tracklist = new Tracklist({
      key: 'tracklist',
      activeTrack: this.props.activeTrack,
      itemHeight: this.props.itemHeight,
      tracks: tracks,
      totalTracks: this.props.tracks.count()
    });

    var activeTrack = new ActiveTrack({
      key: 'active-track',
      track: this.props.activeTrack
    });

    var tracklistEl = dom.div()
      .className('tracklist')
      .append(name, tracklist)
      .make();

    var list = dom.div()
      .className('scroll-wrapper')
      .attr('ref', 'view')
      .key('tracklist-wrapper')
      .append(tracklistEl)
      .make();

    return dom.div()
      .className('tracklist-card')
      .append(list)
      .append(activeTrack)
      .make();
  },

  getVisibleRange: function () {
    if (this.state.y >= 0) {
      return [0, 20];
    }

    var s = (-this.state.y / this.props.itemHeight) | 0;
    return [s, s + 100];
  }
});