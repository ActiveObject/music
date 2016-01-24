import React from 'react';
import TrackCtrl from 'app/tracklist/TrackCtrl';

const StaticTracklist = ({ tracks, limit = 5 }) =>
  <div>
    {tracks.slice(0, limit).map(t => <TrackCtrl key={t.id} track={t} tracklist={tracks} />)}
  </div>

export default StaticTracklist;
