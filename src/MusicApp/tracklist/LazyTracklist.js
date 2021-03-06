import React from 'react';
import throttle from 'lodash/throttle';
import IScroll from 'iscroll/build/iscroll-probe';
import Cursor from './cursor';
import TrackCtrl from './TrackCtrl';

class TrackContainer extends React.Component {
  render() {
    return <TrackCtrl
      audio={this.props.audio}
      track={this.props.track}
      currentTrack={this.props.currentTrack}
      tracklist={this.props.tracklist} />
  }
}

let ScrollContainer = ({ yOffset, children }) => {
  var style = {
    transform: `translate(0, ${yOffset}px)`,
    position: 'absolute',
    left: 0,
    width: '100%'
  };

  return (
    <div className='track-container' style={style}>
      {children}
    </div>
  );
}

class LazyTracklist extends React.Component {
  state = {
    cursor: new Cursor(this.props.tracks, {
      itemHeight: this.props.itemHeight,
      pageSize: this.props.pageSize
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.tracks !== this.props.tracks
      || nextState.cursor.position === this.state.cursor.position
      || nextState.cursor.page() !== this.state.cursor.page();
  }

  componentDidMount() {
    this.scroll = new IScroll(this.refs.wrapper, {
      mouseWheel: true,
      scrollX: false,
      probeType: 3
    });

    this.scroll.on('scroll', throttle(() => {
      this.setState({
        cursor: this.state.cursor.updatePosition(this.scroll.y)
      });
    }), 1000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.tracks !== prevProps.tracks) {
      this.scroll.refresh();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tracks !== nextProps.tracks) {
      this.setState({
        cursor: this.state.cursor.updateItems(nextProps.tracks)
      });
    }
  }

  render() {
    var tracks = this.state.cursor.selection().map(track =>
      <ScrollContainer key={track.value.id} yOffset={track.yOffset}>
        <TrackContainer audio={this.props.audio} currentTrack={this.props.currentTrack} track={track.value} tracklist={this.props.tracks} />
      </ScrollContainer>
    );

    var style = {
      height: this.props.tracks.length * this.props.itemHeight
    };

    return (
      <div className='tracklist scroll-wrapper lazy-tracklist' ref='wrapper'>
        <div className='tracklist-body' style={style}>{tracks}</div>
      </div>
    );
  }
}

LazyTracklist.propTypes = {
  tracks: React.PropTypes.array.isRequired,
  itemHeight: React.PropTypes.number
};

LazyTracklist.defaultProps = {
  itemHeight: 40,
  pageSize: 10
};

export default LazyTracklist;
