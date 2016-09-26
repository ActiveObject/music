import React from 'react';
import Link from 'react-router/Link';
import UserProfileCtrl from 'app/shared/UserProfile/UserProfileCtrl';
import GroupsListContainer from './GroupsListContainer';
import LibraryStaticTracklist from './LibraryStaticTracklist';
import 'app/shared/ResponsiveGrid.css';

let Home = () =>
  <div className='Home'>
    <UserProfileCtrl />

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
  </div>

export default Home;
