import React from 'react';
import { throttle } from 'underscore';
import IScroll from 'iscroll/build/iscroll-probe';
import Cursor from 'app/values/cursor';
import TrackCtrl from 'app/ui/TrackCtrl';

var TrackContainer = React.createClass({
  propTypes: {
    y: React.PropTypes.number.isRequired
  },

  render: function () {
    var style = {
      transform: `translate(0, ${this.props.y}px)`,
      position: 'absolute',
      left: 0,
      width: '100%'
    };

    return <div className='track-container' style={style}>{this.props.children}</div>;
  }
});

var LazyTracklist = React.createClass({
  propTypes: {
    tracks: React.PropTypes.object.isRequired,
    itemHeight: React.PropTypes.number
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

    this.scroll = new IScroll(this.getDOMNode(), {
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
      return (
        <TrackContainer key={track.value.id} y={track.yOffset}>
          <TrackCtrl track={track.value} />
        </TrackContainer>
      );
    });

    var style = {
      height: this.props.tracks.count() * this.props.itemHeight
    };

    return (
      <div className='tracklist scroll-wrapper lazy-tracklist' key='tracklist-wrapper'>
        <div className='tracklist-body' style={style}>{tracks}</div>
      </div>
    );
  }
});

export default LazyTracklist;
