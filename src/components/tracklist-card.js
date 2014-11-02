var _ = require('underscore');
var React = require('react');
var IScroll = require('iscroll/build/iscroll-probe');
var debug = require('debug')('app:tracklist-card');
var dom = require('app/core/dom');
var Tracklist = require('app/components/tracklist');
var ActiveTrack = require('app/components/active-track');
var isEmpty = require('app/utils').isEmpty;

function range(page, pageSize, direction) {
  if (direction === 0) {
    return [(page - 3) * pageSize, (page + 3) * pageSize];
  }

  if (direction < 0) {
    return [(page - 3) * pageSize, (page + 5) * pageSize];
  }

  if (direction > 0) {
    return [(page - 5) * pageSize, (page + 4) * pageSize];
  }
}

module.exports = React.createClass({
  displayName: 'TracklistCard',

  propTypes: {
    activeTrack: React.PropTypes.object.isRequired,
    tracks: React.PropTypes.object.isRequired,
    name: React.PropTypes.string
  },

  getInitialState: function () {
    return { y: 0, direction: 0 };
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
      component.setState({ y: this.y, direction: this.y - component.state.y  });
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
      .filter(_.negate(isEmpty))
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
    var pageSize = this.props.pageSize,
        direction = this.state.direction;

    if (this.state.y >= 0) {
      return [0, pageSize * 4];
    }

    var itemA = (-this.state.y / this.props.itemHeight) | 0,
        page = itemA / pageSize | 0,
        itemR = itemA % pageSize,
        r = range(page, pageSize, direction);

    if (r[0] < 0) {
      return [0, r[1]];
    }

    if (r[1] > this.props.tracks.count()) {
      return [r[0], this.props.tracks.count()];
    }

    return r;
  }
});