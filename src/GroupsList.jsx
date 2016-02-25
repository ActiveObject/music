import React from 'react';

let Group = ({ value }) =>
  <div className='group track' style={{ height: 50 }}>
    <div style={{ borderRadius: '50%', margin: '0 10px', overflow: 'hidden', width: 30, height: 30 }}>
      <img src={value.photo_50} width={30} height={30} />
    </div>
    <span>{value.name}</span>
  </div>

let GroupsList = ({ groups }) =>
  <div className='groups-list'>
    {groups.map(v => <Group value={v} />)}
  </div>

export default GroupsList;
