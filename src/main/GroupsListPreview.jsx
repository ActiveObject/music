import React from 'react';
import 'app/shared/tracklist/TracklistPreview.css';
import 'app/shared/tracklist/track.css';
import './GroupsListPreview.css';
import './GroupsList.css';

let randomNum = (min, max) => min + Math.floor(Math.random() * (max - min));
let repeat = (n, fn) => Array(...Array(n)).map((_, i) => fn(i))

let GroupPreview = () => (
  <div className='track' style={{ height: 50 }}>
    <div className='GroupsList__image'>
      <div className='GroupsListPreview__image-block'></div>
    </div>
    <div className='GroupsList__title'>
      <div className='TracklistPreview__block' style={{ width: `${randomNum(50, 100)}%` }} />
    </div>
  </div>
);

let GroupsListPreview = ({ isActive, numOfItems, children }) => {
  if (isActive) {
    return (
      <div>
        {repeat(numOfItems, (i) => <GroupPreview key={i} />)}
      </div>
    );
  }

  return children;
}

export default GroupsListPreview;
