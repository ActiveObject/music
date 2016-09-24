import React from 'react';
import Link from 'react-router/Link';
import UserProfileCtrl from 'app/shared/UserProfile/UserProfileCtrl';
import PlayBtnCtrl from 'app/shared/PlayBtn/PlayBtnCtrl';
import GroupsListContainer from './GroupsListContainer';
import LibraryStaticTracklist from './LibraryStaticTracklist';
import 'app/shared/ResponsiveGrid.css';

let Home = () =>
  <div className='Home'>
    <div className='scroll-container'>
      <div className='section'>
        <UserProfileCtrl />
      </div>

      <div className='section'>
        <div className='content'>
          <div className='header'>
            <Link to='/library'>Library</Link>
          </div>
          <LibraryStaticTracklist />
        </div>
      </div>

      <div className='section page-section'>
        <div className='content'>
          <div className='header'>Groups</div>
          <GroupsListContainer />
        </div>
      </div>
    </div>

    <PlayBtnCtrl />
  </div>

export default Home;
