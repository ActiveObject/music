import React from 'react';

import IScrollLayer from 'app/ui/iscroll-layer';
import LazyTracklist from 'app/ui/LazyTracklist';

var PlaylistUI = React.createClass({
  render: function () {
    return (
      <div className='playlist' style={{ transform: `scale(${this.props.zoom / 100}) translate(0, ${this.props.y}px)`}}>
        <div className='playlist__content'>
          <div className='playlist__columns'>
            <div className='track__index'>#</div>
            <div className='track__artist'>artist</div>
            <div className='track__title'>track</div>
            <div className='track__duration'>time</div>
          </div>
          <div className='playlist__table'>
            <LazyTracklist tracks={this.props.tracks} />
          </div>
        </div>
        <div className='playlist__paginator'></div>
      </div>
    )
  }
});

export default PlaylistUI;