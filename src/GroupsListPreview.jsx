import React from 'react';
import 'app/tracklist/TracklistPreview.css';
import 'app/tracklist/track.css';
import './GroupsListPreview.css';

let randomNum = (min, max) => min + Math.floor(Math.random() * (max - min));
let repeat = (n, fn) => Array(...Array(n)).map((_, i) => fn(i))

let GroupPreview = () => (
  <div className='track' style={{ height: 50 }}>
    <div className='GroupsListPreview__image'>
      <div className='GroupsListPreview__image-block'></div>
    </div>
    <div className='GroupsListPreview__title'>
      <div className='TracklistPreview__block' style={{ width: `${randomNum(50, 100)}%` }} />
    </div>
  </div>
);

let GroupsListPreview = ({ numOfItems }) => (
  <div>
    {repeat(numOfItems, (i) => <GroupPreview key={i} />)}
  </div>
);

export default GroupsListPreview;
