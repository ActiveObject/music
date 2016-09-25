import React from 'react';
import Link from 'react-router/Link';
import PlayerView from 'app/shared/PlayerView';
import GroupsListContainer from './GroupsListContainer';
import LibraryStaticTracklist from './LibraryStaticTracklist';
import 'app/shared/ResponsiveGrid.css';
import Soundmanager from 'app/shared/Soundmanager';

let Home = () =>
  <div className='Home'>
    <section>
      <header>
        <Link to='/library'>Library</Link>
      </header>
      <LibraryStaticTracklist />
    </section>

    <section className='page-section'>
      <header>Groups</header>
      <GroupsListContainer />
    </section>

    <Soundmanager>
      <PlayerView />
    </Soundmanager>
  </div>

export default Home;
