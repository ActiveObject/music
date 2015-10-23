import React from 'react';
import { throttle } from 'underscore';
import IScroll from 'iscroll/build/iscroll-probe';
import Cursor from './cursor';
import TrackCtrl from './TrackCtrl';

var LazyTracklist = React.createClass({
  propTypes: {
    tracks: React.PropTypes.object.isRequired,
    itemHeight: React.PropTypes.number
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return nextProps.tracks !== this.props.tracks
      || nextState.cursor.position === this.state.cursor.position
      || nextState.cursor.page() !== this.state.cursor.page();
  },

  getInitialState: function () {
    return {
      cursor: new Cursor(this.props.tracks.toJS(), {
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

    this.scroll = new IScroll(this.refs.wrapper, {
      mouseWheel: true,
      scrollX: false,
      probeType: 3
    });

    this.scroll.on('scroll', throttle(function () {
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
      var style = {
        transform: `translate(0, ${track.yOffset}px)`,
        position: 'absolute',
        left: 0,
        width: '100%'
      };

      return (
        <div key={track.value.id} className='track-container' style={style}>
          <TrackCtrl track={track.value} tracklist={this.props.tracks} />
        </div>
      );
    }, this);

    var style = {
      height: this.props.tracks.count() * this.props.itemHeight
    };

    return (
      <div className='tracklist scroll-wrapper lazy-tracklist' key='tracklist-wrapper' ref='wrapper'>
        <div className='tracklist-body' style={style}>{tracks}</div>
      </div>
    );
  }
});

export default LazyTracklist;
