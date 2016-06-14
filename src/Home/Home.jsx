import React from 'react';
import Link from 'react-router/lib/Link';
import { Section, Header, Content } from 'app/shared/ResponsiveGrid';
import ProfileCtrl from 'app/shared/user-profile/ProfileCtrl';
import PlayBtnCtrl from 'app/shared/PlayBtn/PlayBtnCtrl';
import GroupsListContainer from './GroupsListContainer';
import LibraryStaticTracklist from './LibraryStaticTracklist';

let Home = () =>
  <div className='Home'>
    <div className='scroll-container'>
      <Section>
        <ProfileCtrl />
      </Section>

      <Section>
        <Content>
          <Header>
            <Link to='/library'>Library</Link>
          </Header>
          <LibraryStaticTracklist />
        </Content>
      </Section>

      <Section className='page-section'>
        <Content>
          <Header>Groups</Header>
          <GroupsListContainer />
        </Content>
      </Section>
    </div>

    <PlayBtnCtrl />
  </div>

export default Home;
