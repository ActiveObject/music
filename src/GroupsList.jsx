import React from 'react';
import './GroupsList.css';

let Group = ({ value }) =>
  <div className='track' style={{ height: 50 }}>
    <div className='GroupsList__image' style={{ width: 30, height: 30 }}>
      <img src={value.photo_50} width={30} height={30} />
    </div>
    <div className='GroupsList__name'>{value.name}</div>
  </div>

let GroupsList = ({ groups }) =>
  <div className='groups-list'>
    {groups.map(v => <Group value={v} />)}
  </div>

export default GroupsList;
