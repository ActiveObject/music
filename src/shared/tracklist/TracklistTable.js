import React from 'react';
import './TracklistTable.css';

const TracklistTable = ({ children }) =>
  <div className='TracklistTable'>
    <div className='TracklistTable__content'>
      <div className='TracklistTable__columns'>
        <div className='track__index'>#</div>
        <div className='track__artist'>artist</div>
        <div className='track__title'>track</div>
        <div className='track__duration'>time</div>
      </div>
      <div className='TracklistTable__table'>
        {children}
      </div>
    </div>
  </div>

export default TracklistTable;
