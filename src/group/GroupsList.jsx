import React from 'react';
import Link from 'react-router/lib/Link';
import './GroupsList.css';

let Group = ({ value }) =>
  <div className='track' style={{ height: 50 }}>
    <div className='GroupsList__image' style={{ width: 30, height: 30 }}>
      <img src={value.photo_50} width={30} height={30} />
    </div>
    <div className='GroupsList__name'>
      <Link to={`/groups/${value.id}`}>{value.name}</Link>
    </div>
  </div>

let GroupsList = ({ groups }) =>
  <div className='groups-list'>
    {groups.map(v => <Group key={v.id} value={v} />)}
  </div>

export default GroupsList;
