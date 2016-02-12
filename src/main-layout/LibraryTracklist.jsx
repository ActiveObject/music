import React from 'react';
import { Motion, spring } from 'react-motion';
import app from 'app';
import { updateOn } from 'app/renderer';
import { hasTag } from 'app/Tag';
import TracklistTable from 'app/tracklist/TracklistTable';
import LazyTracklist from 'app/tracklist/LazyTracklist';
import { List } from 'immutable';

const AnimationContainer = ({ children }) => {
  var isCmdActivated = hasTag(app.value.get(':db/command-palette'), ':cmd/is-activated');

  return (
    <Motion
      defaultStyle={{
        zoom: 100,
        y: 0,
        opacity: 100
      }}

      style={{
        zoom: spring(isCmdActivated ? 80 : 100),
        y: spring(isCmdActivated ? 200 : 0),
        opacity: spring(isCmdActivated ? 0 : 100)
      }}>
      {interpolated =>
        <div className='main-layout' style={{ transform: `scale(${interpolated.zoom / 100}) translate(0, ${interpolated.y}px)`, opacity: `${interpolated.opacity / 100}` }}>
          {children}
        </div>
      }
    </Motion>
  );
}

const LibraryTracklist = () => {
  var player = app.value.get(':db/player');
  var db = app.value.get(':db/tracks');
  var library = app.value.get(':db/library');
  var tracklist = library.map(t => db.get(t.trackId));

  return (
    <AnimationContainer>
      <TracklistTable>
        <LazyTracklist tracks={List(tracklist)} />
      </TracklistTable>
    </AnimationContainer>
  );
}

export default updateOn(LibraryTracklist, ':db/context', dbVal => dbVal.get(':db/player').tracklist);
