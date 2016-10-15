import React from 'react';
import Link from 'react-router/Link';
import PlayerView from 'app/shared/PlayerView';
import GroupsListContainer from './GroupsListContainer';
import LibraryStaticTracklist from './LibraryStaticTracklist';
import Group from 'app/Group';
import 'app/shared/ResponsiveGrid.css';

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
      <GroupsListContainer>
        {groups => groups.map(id => <Group key={id} id={id} shape='list-item' />)}
      </GroupsListContainer>
    </section>
  </div>

export default Home;
