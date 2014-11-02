var _ = require('underscore');
var React = require('react');
var IScroll = require('iscroll/build/iscroll-probe');
var debug = require('debug')('app:tracklist-card');
var dom = require('app/core/dom');
var Tracklist = require('app/components/tracklist');
var ActiveTrack = require('app/components/active-track');
var Cursor = require('app/values/cursor');
var isEmpty = require('app/utils').isEmpty;

module.exports = React.createClass({
  displayName: 'TracklistCard',

  propTypes: {
    activeTrack: React.PropTypes.object.isRequired,
    tracks: React.PropTypes.object.isRequired,
    name: React.PropTypes.string
  },

  getInitialState: function () {
    var items = this.props.tracks.filter(_.negate(isEmpty)).toJS();

    return {
      cursor: new Cursor(items, {
        itemHeight: this.props.itemHeight,
        pageSize: this.props.pageSize
      })
    };
  },

  getDefaultProps: function () {
    return {
      itemHeight: 40 + 20,
      pageSize: 10
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
      component.setState({ cursor: component.state.cursor.updatePosition(this.y) });
    }), 1000);
  },

  componentDidUpdate: function (prevProps) {
    if (this.props.tracks !== prevProps.tracks) {
      this.scroll.refresh();
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      cursor: this.state.cursor.updateItems(nextProps.tracks.filter(_.negate(isEmpty)).toJS())
    });
  },

  render: function() {
    var name = dom.div()
      .key('section')
      .className('tracklist-section-name')
      .append(this.props.name + ' (1243)');

    var tracklist = new Tracklist({
      key: 'tracklist',
      activeTrack: this.props.activeTrack,
      itemHeight: this.props.itemHeight,
      tracks: this.state.cursor.selection(),
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
  }
});