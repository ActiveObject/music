import React from 'react';
import './TracklistPreview.css';
import './track.css';

let randomNum = (min, max) => min + Math.floor(Math.random() * (max - min));
let repeat = (n, fn) => Array(...Array(n)).map((_, i) => fn(i))

let TrackPreview = () => (
  <div className='track'>
    <div className='track__index'>
      <div className='preview-block' style={{ width: 10 }}></div>
    </div>
    <div className='track__artist'>
      <div className='preview-block' style={{ width: `${randomNum(50, 100)}%` }} />
    </div>
    <div className='track__title'>
      <div className='preview-block' style={{ width: `${randomNum(50, 100)}%` }} />
    </div>
    <div className='track__duration'>
      <div className='preview-block' style={{ width: 30 }}></div>
    </div>
  </div>
);

let TracklistPreview = ({ numOfItems }) => (
  <div>
    {repeat(numOfItems, (i) => <TrackPreview key={i} />)}
  </div>
);

export default TracklistPreview;
