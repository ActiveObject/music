import React from 'react';
import Link from 'react-router/Link';
import PlayerView from 'app/shared/PlayerView';
import GroupsListContainer from './GroupsListContainer';
import FetchLibrary from './FetchLibrary';
import Group from 'app/Group';
import 'app/shared/ResponsiveGrid.css';
import TracklistTable from 'app/shared/tracklist/TracklistTable';
import TracklistPreview from 'app/shared/tracklist/TracklistPreview';
import StaticTracklist from 'app/shared/tracklist/StaticTracklist';

let Home = () =>
  <div className='Home'>
    <section>
      <header>
        <Link to='/library'>Library</Link>
      </header>
      <FetchLibrary>
        {tracks =>
          <TracklistTable>
            <TracklistPreview isActive={tracks.length === 0} numOfItems={10}>
              <StaticTracklist tracks={tracks} limit={10} />
            </TracklistPreview>
          </TracklistTable>
        }
      </FetchLibrary>
    </section>

    <section className='page-section'>
      <header>Groups</header>
      <GroupsListContainer>
        {groups => groups.map(id => <Group key={id} id={id} shape='list-item' />)}
      </GroupsListContainer>
    </section>
  </div>

export default Home;
