require('app/styles/tracklist.styl');

var React = require('react');
var _ = require('underscore');
var debug = require('debug')('app:tracklist');
var IScroll = require('iscroll/build/iscroll-probe');
var dom = require('app/core/dom');
var Track = require('app/components/track');
var Cursor = require('app/values/cursor');

module.exports = React.createClass({
  displayName: 'Tracklist',

  propTypes: {
    player: React.PropTypes.object.isRequired,
    tracks: React.PropTypes.object.isRequired,
    itemHeight: React.PropTypes.number.isRequired
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return nextState.cursor !== this.state.cursor ||
      nextProps.player.id !== this.props.player.id ||
      nextProps.player.isPlaying !== this.props.player.isPlaying ||
      nextProps.tracks !== this.props.tracks ||
      nextProps.itemHeight !== this.props.itemHeight;
  },

  getInitialState: function () {
    var items = this.props.tracks.toJS();

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
    if (this.props.tracks !== nextProps.tracks) {
      this.setState({
        cursor: this.state.cursor.updateItems(nextProps.tracks.toJS())
      });
    }
  },

  render: function() {
    var tracks = this.state.cursor.selection().map(function (track) {
      return new Track({
        key: track.value.id,
        track: track.value,
        y: track.yOffset,
        player: this.props.player
      });
    }, this);

    var body = dom.div()
      .className('tracklist-body')
      .attr('style', { height: this.props.tracks.count() * this.props.itemHeight })
      .append(tracks)
      .make();

    return dom.div()
      .className('tracklist scroll-wrapper')
      .attr('ref', 'view')
      .key('tracklist-wrapper')
      .append(body)
      .make();
  }
});
