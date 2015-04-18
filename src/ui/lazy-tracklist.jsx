require('app/styles/tracklist.styl');
require('app/styles/lazy-tracklist.styl');

var React = require('react');
var throttle = require('underscore').throttle;
var IScroll = require('iscroll/build/iscroll-probe');
var vbus = require('app/core/vbus');
var Track = require('app/ui/track');
var Cursor = require('app/values/cursor');

var TrackContainer = React.createClass({
  propTypes: {
    y: React.PropTypes.number.isRequired
  },

  render: function () {
    var style = {
      transform: `translate(0, ${this.props.y}px)`
    };

    return <div className='track-container' style={style}>{this.props.children}</div>;
  }
});

var LazyTracklist = React.createClass({
  propTypes: {
    player: React.PropTypes.object.isRequired,
    tracklist: React.PropTypes.object.isRequired,
    itemHeight: React.PropTypes.number.isRequired
  },

  getInitialState: function () {
    var items = this.props.tracklist.playlist.tracks.toJS().slice(0, 5);

    return {
      cursor: new Cursor(items, {
        itemHeight: this.props.itemHeight,
        pageSize: this.props.pageSize
      })
    };
  },

  getDefaultProps: function () {
    return {
      itemHeight: 40,
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

    this.scroll.on('scroll', throttle(function () {
      component.setState({ cursor: component.state.cursor.updatePosition(this.y) });
    }), 1000);
  },

  componentDidUpdate: function (prevProps) {
    if (this.props.tracklist !== prevProps.tracklist) {
      this.scroll.refresh();
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.tracklist !== nextProps.tracklist) {
      // this.setState({
      //   cursor: this.state.cursor.updateItems(nextProps.tracklist.playlist.tracks.toJS())
      // });
    }
  },

  render: function() {
    var tracks = this.state.cursor.selection().map(function (track) {
      var isActive = track.value.id === this.props.player.track.id;
      var isPlaying = isActive && this.props.player.isPlaying;

      return (
        <TrackContainer key={track.value.id} y={track.yOffset}>
          <Track
            track={track.value}
            tracklist={this.props.tracklist}
            isActive={isActive}
            isPlaying={isPlaying}
            onTogglePlay={this.togglePlay} />
        </TrackContainer>
      );
    }, this);

    var style = {
      height: this.props.tracklist.playlist.tracks.count() * this.props.itemHeight
    };

    return (
      <div ref='view' className='tracklist scroll-wrapper lazy-tracklist' key='tracklist-wrapper'>
        <div className='tracklist-body' style={style}>{tracks}</div>
      </div>
    );
  },

  togglePlay: function (track) {
    vbus.emit(this.props.player.togglePlay(track, this.props.tracklist));
  }
});

module.exports = LazyTracklist;
